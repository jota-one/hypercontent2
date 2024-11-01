// @ts-check
import jota from 'eslint-config-jota'
import easier from 'eslint-config-jota/easier'
import tseslint from 'typescript-eslint'

export default tseslint.config(...jota, ...easier)
