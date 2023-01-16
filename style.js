import { name } from './package.json' assert { type: 'json' }

import style from './style.css' assert { type: 'text' }

export default function createStyle(preferCdn = false) {
  return preferCdn
    ? `<link rel="stylesheet" href="//unpkg.com/${name}@latest/style.css">`
    : `<style rel="remark-code-tabs">${style}</style>`
}
