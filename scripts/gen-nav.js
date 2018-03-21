const fs = require('fs')
const tableRe = /^[\-\+]\s?.*(\n^\s*[\-\+].*)*/m
const anchorTitleRe = /(\s*)[\+\-]\s*\[(.*)\]\((.*)\)/
const titleRe = /^(\s*)[\+\-]\s*([^[]*)/

function genTableJSONFromMarkdown(source, target, prefix) {
  const contents = fs.readFileSync(source, 'utf8')
  const reResult = tableRe.exec(contents)
  let NavData = { children: [] }
  try {
    const lines = reResult[0].split('\n')
    let level, lastLevel, parentNav, nav, lastParentNav, lastNav

    lines.forEach((i, idx) => {
      let space, name, link
      const r1 = anchorTitleRe.exec(i)
      const r2 = titleRe.exec(i)
      if (r1) {
        space = r1[1]
        name = r1[2]
        if (/^https?:\/\//.test(r1[3])) {
          link = r1[3]
        } else {
          link = prefix + r1[3].replace('.md', '/')
        }
      } else if (r2) {
        space = r2[1]
        name = r2[2]
      } else {
        return
      }
      level = space.length / 2
      if (idx === 0) {
        lastLevel = 0
        level = 0
        lastParentNav = NavData
      }
      nav = { name, link }
      if (level === lastLevel) {
        nav.parent = lastParentNav
        lastParentNav.children.push(nav)
      }
      if (level > lastLevel) {
        if (!lastNav.children) {
          lastNav.children = []
        }
        nav.parent = lastNav
        lastNav.children.push(nav)
        lastParentNav = lastNav
      }
      if (level < lastLevel) {
        let diff = lastLevel - level
        while (--diff >= 0) {
          lastParentNav = lastParentNav.parent
        }
        nav.parent = lastParentNav
        lastParentNav.children.push(nav)
      }

      lastLevel = level
      lastNav = nav
    })
    // clean/remove all parent key
  } catch (e) {
    console.log('regexp markdown tables parse error')
  }

  function iterObjProcess(obj) {
    const ret = Object.assign(Array.isArray(obj) ? [] : {}, obj)
    for (var key in obj) {
      if (obj[key] == null) continue
      if (key === 'parent') {
        delete ret[key]
      } else {
        if (typeof obj[key] === 'object') {
          ret[key] = iterObjProcess(obj[key])
        }
      }
    }
    return ret
  }
  const jsonTable = JSON.stringify(iterObjProcess(NavData.children), null, 2)
  console.log(jsonTable)

  fs.writeFileSync(target, jsonTable, 'utf8')
}

var args = process.argv.slice(2)
if (args.length != 3) {
  console.log(
    'Usage: node <this> arg1 arg2 arg3 # arg1 markdown source path, arg2 json file path arg3 url prefix'
  )
}
genTableJSONFromMarkdown(args[0], args[1], args[2])
