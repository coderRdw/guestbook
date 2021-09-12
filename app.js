//! 把所有的包提前导入
const fs = require('fs')
const http = require('http')
const template = require('art-template')
const url = require('url')
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
  // 使用url.parse方法将路径解析为一个方便操作的!对象!，第二个参数为true
  let parseObj = url.parse(req.url, true)
  // true属性将字符串转为对象，便于拿数据
  // pathName是指url中不包含查询字符串的路径部分（不包括？之后的部分）
  let pathName = parseObj.pathname

  if (pathName === '/') {
    fs.readFile('./views/index.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      const content = template.render(data.toString(), {
        comments : comments
      })
      res.end(content)
    })
  } else if (pathName === '/comments') {
    // !获取/comments?name=xxx?
    // 1.获取表单数据
    // 2.生成日期
    // 3.重定向至首页
    let comment = parseObj.query
    comment.dateTime = '2021-09-12'
    comments.unshift(comment)
    // console.log(comments)
    // 如何通过服务器让客户端重定向？
    // 1.状态码设置为302临时重定向 301永久重定向
    // statusCode
    // 2.在响应头重通过location告诉客户端往哪重定向
    // setHeader
    // 若客户端收到服务器的状态码是302，就会自动去响应头重查找location,从而得以重定向
    res.statusCode = 302
    res.setHeader('Location','/')
    res.end()
  } else if (pathName === '/post') {
    fs.readFile('./views/post.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      res.end(data)
    })
    // !这里使用indexOf方法是为了匹配url
  } else if (pathName.indexOf('/public/') === 0) {
    fs.readFile('.' + pathName, (err, data) => {
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

// 