/*
  Express API
  - 返回所有的 contributors
*/

const jsonServer = require('json-server')
const bodyParser = require('body-parser')

//创建一个 Express 服务器
const server = jsonServer.create()

//使用 json-server 默认选择的中间件（logger，static, cors 和 no-cache）
server.use(jsonServer.defaults())

//使用 body-parser 中间件
server.use(bodyParser.json())

// 暴露 contributors list
const fs = require('fs')

let contributorsData

fs.stat(`${__dirname}/../data/contributors.json`, (err, stats) => {
  if (err) throw err
  else {
    contributorsData = JSON.parse(
      fs.readFileSync(`${__dirname}/../data/contributors.json`, 'utf8')
    )

    fs.watchFile(`${__dirname}/../data/contributors.json`, function(
      curr,
      prev
    ) {
      console.log('the current mtime is: ' + curr.mtime)
      console.log('the previous mtime was: ' + prev.mtime)
      contributorsData = JSON.parse(
        fs.readFileSync(`${__dirname}/../data/contributors.json`, 'utf8')
      )
    })
  }
})

server.get('/api/contributors', (req, res) => {
  if (contributorsData) res.json({ code: 200, data: contributorsData })
  else res.json({ code: 500, data: null })
})

//启动服务，并监听5000端口
server.listen(5000, () => {
  console.log('server is running at ', 5000)
})
