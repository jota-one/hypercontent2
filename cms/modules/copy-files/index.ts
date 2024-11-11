const run = async ({ dest }: { dest: string }) => {
  const fs = require('fs/promises')
  const path = require('path')
  const src = path.resolve(__dirname, 'template')
  console.log('Will copy', src)
  console.log('--> into', dest)
  await fs.cp(src, dest, { recursive: true })
  console.log('🎉 The files were successfully copied!')

  await fs.rm(path.resolve(dest, 'app.vue'))
  console.log('🎉 The repository was cleaned up!')
}
export default () => ({ run })
