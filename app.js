//! 把所有的包提前导入
const fs = require('fs')
const http = require('http')
const template = require('art-template')
// 1.将所有的html页面都放在views中
// 2.为了方便请求资源，将这些静态资源放在public目录中
// 3.public目录中所有资源都可以被访问
// let server = http.createServer()
// server.on('request', (req, res) => {
//   res.end('hhh')
// })
// server.listen(3000, ()=> {
//   console.log('serve is running')
// })
// ?静态数据
const comments = [
  {
    name : '张三',
    message : '今天天气挺好',
    dateTime : '2021-09-11'
  },
  {
    name : '李四',
    message : '你好',
    dateTime : '2021-09-11'
  },
  {
    name : '王五',
    message : '你好',
    dateTime : '2021-09-11'
  },
  {
    name : '王小二',
    message : '你好',
    dateTime : '2021-09-11'
  }
]
// 链式调用格式
http.createServer((req, res) => {
    const url = req.url
  if (url === '/') {
    fs.readFile('./views/index.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      const content = template.render(data.toString(), {
        comments : comments
      })
      res.end(content)
    })
  } else if (url === '/post') {
    fs.readFile('./views/post.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      res.end(data)
    })
    // !这里使用indexOf方法是为了匹配url
  } else if (url.indexOf('/public/') === 0) {
    fs.readFile('.' + url, (err, data) => {
      if (err) {
        return res.end('404')
      } 
      res.end(data)
    })
  } else {
    fs.readFile('./views/404.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      res.end(data)
    })
  }
}).listen(3000, () => {
  console.log('serve is running')
})