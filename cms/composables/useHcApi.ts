import { fetchEndpoint } from '../common/backend'
import { HC_ENDPOINTS } from '../common/config'
import {
  isEmpty,
  omit,
  resolveEndpointDefPlaceholders,
} from '../common/helpers'
import type { HcContentsResponse, HcPagesLangResponse, page } from '../types'
import type { BaseBlock, ParentBlock } from '../types/block'
import type { ImportingPage } from '../types/page'

type Texpand = {
  Content: HcContentsResponse
}

const findBlockById = (blocks: ParentBlock[], id: string) => {
  return blocks.reduce((acc, block): BaseBlock => {
    if (!isEmpty(acc)) {
      return acc as BaseBlock
    }
    if (block.id === id) {
      return block
    } else if (block.children && block.children.length) {
      return findBlockById(block.children || [], id)
    }
    return acc
  }, {} as BaseBlock)
}

const replaceBlockById = (
  blocks: ParentBlock[],
  blockToUpdate: ParentBlock
) => {
  return blocks.reduce((acc, block): ParentBlock[] => {
    if (block.id === blockToUpdate.id) {
      return acc.concat([blockToUpdate])
    } else if (block.children && block.children.length) {
      block.children = replaceBlockById(block.children, blockToUpdate)
    }
    return acc.concat([block])
  }, [] as ParentBlock[])
}

export default function useHcApi() {
  const { getToken } = useHcAuth()
  const runtimeConfig = useRuntimeConfig()

  const fetchRecord = async <T = unknown>(collection: string, id: string) => {
    const url = `${runtimeConfig.public.hypercontent.remoteApi}/collections/${collection}/records/${id}`
    const result = await fetchEndpoint(url)
    return result.json as T
  }

  const fetchContent = async (path: string) => {
    const page = await fetchEndpoint<ImportingPage>(
      resolveEndpointDefPlaceholders(
        runtimeConfig.public.hypercontent.remoteApi +
          HC_ENDPOINTS.navigation.byPath,
        {
          path,
        }
      )
    )
    if (page.json.totalItems !== 1) {
      throw new Error(
        'Should return exactly 1 result. There is probably an issue in the database.'
      )
    }

    const content = await fetchRecord<HcPageContent>(
      'HcContents',
      page.json.items[0].contentId as string
    )

    return 'yoh'
  }

  const updateBlock = async <B extends ParentBlock>(
    page: page.HcParsedPage,
    model: B
  ) => {
    // retrieve the page content from the db
    const response = await fetch(
      `${runtimeConfig.public.hypercontent.remoteApi}${page.apiUrl}?expand=Content`
    )
    const pageDb = (await response.json()) as HcPagesLangResponse<Texpand>
    const content = pageDb.expand?.Content
    const block = findBlockById(
      content?.blocks as ParentBlock[],
      model?.id || ''
    ) as B

    // update the block
    const updatedBlock = {
      ...block,
      props: { ...block.props, ...omit(model, ['id']) },
    }

    // save the content
    const updatedContent = replaceBlockById(
      content?.blocks as ParentBlock[],
      updatedBlock
    )
    const result = await fetch(
      `${runtimeConfig.public.hypercontent.remoteApi}${page.contentUrl}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          blocks: JSON.stringify(updatedContent),
          state: 'draft',
          editorVersion: '2.26.5',
        }),
        headers: {
          authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return updatedContent
  }

  return {
    fetchContent,
    updateBlock,
  }
}
