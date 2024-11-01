const run = async () => {
  const fs = require('fs/promises')

  const definition = await fs.readFile('./package.json', 'utf8')
  const json = JSON.parse(definition)

  json.scripts = {
    ...json.scripts,
    db: './pb/pocketbase serve',
    lint: 'eslint .',
    'type-check': 'vue-tsc --noEmit -p tsconfig.json --composite false',
  }

  json.devDependencies = {
    ...(json.devDependencies || {}),
    'eslint-config-jota': '^1.0.0',
    'typescript-eslint': '^8.4.0',
  }

  await fs.writeFile('./package.json', JSON.stringify(json, null, 2), 'utf8')
  console.log('🎉 package.json file updated.')
}
export default () => ({ run })
