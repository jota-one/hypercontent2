// @ts-check
import jota from 'eslint-config-jota'
import easier from 'eslint-config-jota/easier'
import tseslint from 'typescript-eslint'

const ignores = tseslint.config({
  ignores: ['**/.nuxt/', '**/dist/'],
})

export default tseslint.config(...jota, ...easier, ...ignores)
