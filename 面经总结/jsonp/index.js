var http = require('http')
var url = require('url')
var port = process.argv[2]

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var path = parsedUrl.pathname
  var query = parsedUrl.query

  if (path === '/pay') {
    response.setHeader('Content-Type','text/javacript;charset=utf-8')
    response.write(`
      ${query.callbackName}.call(undefined,'success')
    `)
    response.end()
  }
})

server.listen(port)
console.log('监听 ' + port + '成功')