/*
  Express API
  - 返回所有的 contributors
*/

const jsonServer = require('json-server');
const bodyParser = require('body-parser');


//创建一个 Express 服务器
const server = jsonServer.create();

//使用 json-server 默认选择的中间件（logger，static, cors 和 no-cache）
server.use(jsonServer.defaults());

//使用 body-parser 中间件
server.use(bodyParser.json());

// 暴露 contributors list
const fs = require('fs')

const contributorsData = JSON.parse(fs.readFileSync(`data/contributors.json`, 'utf8'))
server.get('/api/contributors', (req, res)=>{
  res.json(contributorsData)
})

//启动服务，并监听5000端口
server.listen(5000, () => {
  console.log('server is running at ', 5000);
});
