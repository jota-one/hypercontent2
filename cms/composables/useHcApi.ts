import { isEmpty } from '../common/helpers'
import type { HcContentsResponse, HcPagesLangResponse, page } from '../types'
import type { BaseBlock, ParentBlock } from '../types/block'

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

export default function useHcApi() {
  const updateBlock = async <B extends ParentBlock>(
    page: page.HcParsedPage,
    type: string,
    model: B
  ) => {
    const runtimeConfig = useRuntimeConfig()

    // retrieve the page content from the db
    const response = await fetch(
      `${runtimeConfig.public.hypercontent.remoteApi}${page.apiUrl}?expand=Content`
    )
    const pageDb = (await response.json()) as HcPagesLangResponse<Texpand>
    const content = pageDb.expand?.Content
    const block = findBlockById(content?.blocks as ParentBlock[], model.id) as B

    // update the block
    const updatedBlock = { ...block, props: { ...block.props, ...model } }

    // save the content
    const result = await fetch(
      `${runtimeConfig.public.hypercontent.remoteApi}${page.apiUrl}`,
      { method: 'PATCH', body: JSON.stringify(updatedBlock) }
    )
  }

  return {
    updateBlock,
  }
}
