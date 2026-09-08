import http, { IncomingMessage, ServerResponse } from 'http'
import { itemsRoute } from './routes/itemsRoute.js';

const PORT = 4000;

//Executed everytime server gets a request from the client 
//Server object that holds information about requests and sends back response
const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    //Creates response header with status code -200 and specifies the type which is json
    if (req.url?.startsWith("/items")) {
        itemsRoute(req, res)
    }
    else {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Hi ,testing " }))
    }
}
//Starts a server 
const server = http.createServer(requestListener)
//Listens to the port 
server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})