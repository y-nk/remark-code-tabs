import { readFileSync } from 'fs'

// import { name, version } from './package.json' assert { type: 'json' }
const { name, version } = JSON.parse(
  readFileSync(
    new URL('package.json', import.meta.url),
    'utf-8',
  )
)

// import style from './style.css' assert { type: 'text' }
const style = readFileSync(
  new URL('style.css', import.meta.url),
  'utf-8',
)

export default function createStyle(preferCdn = false) {
  return preferCdn
    ? `<link rel="stylesheet" href="//unpkg.com/${name}@${version}/style.css">`
    : `<style rel="remark-code-tabs">${style}</style>`
}
