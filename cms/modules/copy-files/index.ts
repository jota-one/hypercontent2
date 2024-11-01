const run = async ({
  dest
                   }: {
  dest: string
}) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  })
  await promise
  console.log('files installed')
}
export default () => ({ run })
