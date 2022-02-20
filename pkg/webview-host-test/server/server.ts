import * as http from 'http'

const site = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nested Frame</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>
    console.log(window.crossOriginIsolated)
  </script>
</body>
</html>
`

const requestListener: http.RequestListener = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  })
  res.end(site)
}

const server1 = http.createServer(requestListener)
const server2 = http.createServer(requestListener)
server1.listen(8080)
server2.listen(8081)
