const http = require('http')
const port = 8080
const ip = 'localhost'
var i = 1;
const server = http.createServer((req, res) => {
  console.log('Recebendo request ' + i)
  i++;
  res.end('<h1>Resposta normal</h1>')
})

server.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`)
  console.log('Para derrubar o servidor: ctrl + c');
})