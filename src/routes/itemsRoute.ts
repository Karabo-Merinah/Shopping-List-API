import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/shoppingListItems.js";
import { IncomingMessage, ServerResponse } from "node:http";

export const itemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url?.startsWith("/shoppingItems")) {
        console.log(req.url, "request url")
        const parts = req.url.split("/")
        console.log(parts)
        const id = parts[2] ? parseInt(parts[2]) : undefined
        //Get all the items 
        //Firstly checks if the method is GET and there's no ID 
        if (req.method === "GET" && !id) {
            //Sets the status to 200 -ok  and sets response header  
            res.writeHead(200, { "content-type": "application/json" })
            res.end(JSON.stringify(getAllItems()))
            return
        }
        //Get items by id 
        if (req.method === "GET" && id) {
            if (isNaN(id)) {
                //returns it as a bad request status code of 400
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Invalid item id-must be a number" }))
                return
            }
            const items = getItemById(id)
            if (!items) {
                res.writeHead(404, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Item not found" }))
                return
            }
            res.writeHead(200, { "content-type": "application/json" })
            res.end(JSON.stringify(items))
        }

        //POST -Ceate a new shopping list item
        if (req.method === "POST") {
            //Stores all the pieces combined
            let body = ""
            //listen for the event 
            req.on("data", (chunk) => {
                console.log(chunk, "chunk") //chunk is a buffer (a piece of data)
                body += chunk.toString() //convert it to string and add to body 
                console.log(body, "body")
            })
            req.on('end', () => {
                try {
                    const data = JSON.parse(body)
                    const { name, quantity } = data

                      if((!name || name === "") && (!quantity || quantity === "")){
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item quantity and name  both are  required" }))
                        return
                    }
                       if((typeof quantity !== "string") && (typeof name!== "string")){
                          res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad inputs for both inputs -must be string " }))
                        return
                    }
                    if( !name  || typeof name !== "string"){
                         res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item name is required and must be a string" }))
                        return
                    }
                    if (!quantity || typeof quantity !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item quantity is required and must be a string" }))
                        return
                    }
                 
                    const newItem = createItem({ name, quantity })
                    res.writeHead(201, { "content-type": "application/json" })
                    res.end(JSON.stringify(newItem))
                }
                catch (error) {
                    res.writeHead(400, { "content-type": "application/json" })
                    res.end(JSON.stringify({ error: "Invalid JSON payload" }))
                }
            })
            return
        }
        // PUT -Update item by id
        if (req.method === "PUT" && id) {
              if (isNaN(id)) {
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Invalid id input ,must be a number " }))
                return
            }
            let body = ""
            req.on("data", (chunk) => {
                body += chunk.toString()
            })
            req.on("end", () => {
                try {
                    const updateData = JSON.parse(body)
                    const { name, quantity, purchased } = updateData
                    if (updateData.name !== undefined && typeof updateData.name !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for name" }))
                        return
                    }
                    if (updateData.quantity !== undefined && typeof updateData.quantity !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for  quantity" }))
                        return
                    }
                    if (updateData.purchased !== undefined && typeof updateData.purchased !== "boolean") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for purchased " }))
                        return
                    }
                    const updatedItem = updateItem(id, updateData)
                    if (updatedItem) {
                        res.writeHead(200, { "content-type": "application/json" })
                        res.end(JSON.stringify(updatedItem))

                    }
                    else {
                        res.writeHead(404, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item not found" }))

                    }
                }
                catch (error) {
                    res.writeHead(400, { "content-type": "application/json" })
                    res.end(JSON.stringify({ error: "Invalid JSON" }))
                }
            })
            return
        }
        //Delete item by id
        if (req.method === "DELETE" && id) {
            if (isNaN(id)) {
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Bad input for id " }))
                return
            }
            const deleted = deleteItem(id)
            if (deleted) {
                res.writeHead(200, { "content-type": "application/json" })
                res.end(JSON.stringify({ message: "Item deleted successfully" }))
            }
            else {
                res.writeHead(404, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Item not found" }))
            }
            return
        }
        res.writeHead(405, { "content-type": "application/json" })
        res.end(JSON.stringify({ error: "Method not allowed on /shoppingItems" }))


    }
}
