const fs = require("fs/promises");

;(async function run() {
  const fs = require('fs/promises')

  const definition = await fs.readFile('./hypercontent.config.json', 'utf8')
  const json = JSON.parse(definition)

  json.config.hypercontent.generateContent.enabled = true

  await fs.writeFile('./hypercontent.config.json', JSON.stringify(json, null, 2), 'utf8')
  console.log('🎉 hypercontent.config.json file updated.')
})()
