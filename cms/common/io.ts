import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

import { baseConfig as config } from './config'

export const dumpFile = async (
  content: string,
  path: string,
  fileExtension: string
) => {
  const filePath = config.contentBasePath.concat(
    `${path}.${fileExtension}`.split('/').filter(p => p)
  )

  await mkdir(join(...filePath.filter(p => !p.endsWith(`.${fileExtension}`))), {
    recursive: true,
  })

  return writeFile(join(...filePath), content, 'utf-8')
}

export const dumpJson = (json: any, path: string) => {
  return dumpFile(JSON.stringify(json), path, 'json')
}
