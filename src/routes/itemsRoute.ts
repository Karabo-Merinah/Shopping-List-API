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
        //Get items by id and check if id is not a number if it is not then give invalid item id feedback
        if (req.method === "GET" && id) {
            if (isNaN(id)) {
                //returns it as a bad request status code of 400
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Invalid item id-must be a number" }))
                return
            }
            //id is a number and no item falls under the specified id then give status code of 404 
            const items = getItemById(id)
            if (!items) {
                res.writeHead(404, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Item not found" }))
                return
            }
            //if it does exist the item then run status code of 200 
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
                    const { name, quantity,category} = data
                     //if all input fields are empty then run this
                    if ((!name || name === "") && (!quantity || quantity === "") && (!category || category === "")) {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item  inputs  are  required" }))
                        return
                    }
                       //if the  type of the name and quantity is not string  then run this
                    if ((typeof quantity !== "string") && (typeof name !== "string")) {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad inputs for both inputs -must be string " }))
                        return
                    }
                    //if the name is empty or not of type string then run this 
                    if (!name || typeof name !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item name is required and must be a string" }))
                        return
                    }
                    //if the quantity is empty or quantity is not string then run this 
                    if (!quantity || typeof quantity !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Item quantity is required and must be a string" }))
                        return
                    }
                    //if the category is empty or quantity is not a string then run this 
                    if(!category || typeof category !== "string"){
                        res.writeHead(400,{"content-type":"application/json"})
                        res.end(JSON.stringify({error:"Category is required and must be a string"}))
                    }
                    // if the above conditions are not met then run this to create new item .
                    const newItem = createItem({ name, quantity,category})
                    res.writeHead(201, { "content-type": "application/json" })
                    res.end(JSON.stringify(newItem))
                }
                //catch any other errors that are not specified
                catch (error) {
                    res.writeHead(400, { "content-type": "application/json" })
                    res.end(JSON.stringify({ error: "Invalid JSON payload" }))
                }
            })
            return
        }
        // PUT -Update item by id
        if (req.method === "PUT" && id) {
            //checks if the id is not a number,if it's trully not a number then give error of invalid id input.
            if (isNaN(id)) {
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Invalid id input ,must be a number " }))
                return
            }
            let body = ""
            //listen on the data that is received as chunks then convert those chunks to a string
            req.on("data", (chunk) => {
                body += chunk.toString()
            })
            req.on("end", () => {
                try {
                    const updateData = JSON.parse(body)
                       //check if the name is  not undefined and type of name is not string then run  this error 
                    if (updateData.name !== undefined && typeof updateData.name !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for name" }))
                        return
                    }
                     //check if the quantity is  not undefined and type of name is not string then run  this error 
                    if (updateData.quantity !== undefined && typeof updateData.quantity !== "string") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for  quantity" }))
                        return
                    }
                     //check if the purchased is  not undefined and type of purchased is not string then run  this error 
                    if (updateData.purchased !== undefined && typeof updateData.purchased !== "boolean") {
                        res.writeHead(400, { "content-type": "application/json" })
                        res.end(JSON.stringify({ error: "Bad input type for purchased " }))
                        return
                    }
                    //checks if the category is not undefined and type of category is not string then run this error
                    if(updateData.category !== undefined && typeof updateData.category !== "string"){
                        res.writeHead(400,{"content-type":"application/json"})
                        res.end(JSON.stringify({error:"Bad input type for category "}))
                    }
                    //   Update item with given id and input fields
                    const updatedItem = updateItem(id, updateData)
                    if (updatedItem) {
                        res.writeHead(200, { "content-type": "application/json" })
                        res.end(JSON.stringify(updatedItem))
                    }
                   //if no item is found with the specified id
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
        //if request method is Delete and there's id given 
        if (req.method === "DELETE" && id) {
            //Validate if the id is a number ,if it's not then throw an error of bad input for id 
            if (isNaN(id)) {
                res.writeHead(400, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Bad input for id " }))
                return
            }
            const deleted = deleteItem(id)
            // if the id is found then delete the item by showing status code of 200 
            if (deleted) {
                res.writeHead(200, { "content-type": "application/json" })
                res.end(JSON.stringify({ message: "Item deleted successfully" }))
            }
            //if no item is found with that id then throw an error 
            else {
                res.writeHead(404, { "content-type": "application/json" })
                res.end(JSON.stringify({ error: "Item not found" }))
            }
            return
        }
        //all other errors that are  not handled then should fall in this 
        res.writeHead(405, { "content-type": "application/json" })
        res.end(JSON.stringify({ error: "Method not allowed on /shoppingItems" }))


    }
}
