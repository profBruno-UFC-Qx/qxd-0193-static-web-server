import { IncomingMessage, ServerResponse, createServer } from 'http'
import { join, basename } from 'path'
import { readFile, stat } from 'fs/promises'
import { existsSync } from 'fs'

const port = 1010

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  console.log(`${req.method} - ${req.url} `)
  res.setHeader('Content-Type','text/html; charset=utf-8')
  
  if(req.url?.startsWith('/files')) {
    const filename = basename(req.url)
    const filePath = join(__dirname, '../htdocs', filename)
    if(existsSync(filePath) && (await stat(filePath)).isFile()) {
      const fileContent = await readFile(filePath)
      if(filename.endsWith('.html') ||filename.endsWith('.css')) {
        if(filename.endsWith('.css')) {
          res.setHeader('Content-Type','text/css')
        }
        res.writeHead(200)
        res.end(fileContent)        
      } else {
        res.writeHead(400)
        res.end("Formato de arquivo inválido")
      }
    } else {
      res.writeHead(404)
      res.end("Recurso não encontrado")
    }
  } else {
    res.writeHead(403)
    res.end("Recurso inacessível")
  }
});


server.listen(port, () => {
  console.log(`Servidor pronto. Escutando requisições na porta ${port}`)
})