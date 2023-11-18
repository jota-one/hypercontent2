function cleanIndexInPath(pathPart: string) {
  return pathPart.startsWith('[') ? pathPart.replace(/\D/g, '') : pathPart
}

export function get(obj: any, path: string, defaultValue = {}) {
  const result = path.split('.').reduce((r, p) => {
    if (typeof r === 'object' && r !== null) {
      p = cleanIndexInPath(p)

      return r[p]
    }

    return undefined
  }, obj)

  return result === undefined ? defaultValue : result
}
