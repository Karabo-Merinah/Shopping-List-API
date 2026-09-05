import { getAllItems,getItemById,createItem,updateItem,deleteItem } from "../controllers/shoppingListItems.js";
import { IncomingMessage,ServerResponse } from "node:http";

export const itemsRoute=async(req:IncomingMessage,res:ServerResponse)=>{
    if(req.url ?.startsWith("/items")){
        console.log(req.url,"request url")
        const parts=req.url.split("/")
        console.log(parts)
        const id=parts[2] ? parseInt(parts[2]) :undefined
        //Get all the items 
          if(req.method === "GET" && !id){
            res.writeHead(200,{"content-type":"application/json"})
            res.end(JSON.stringify(getAllItems()))
            return 
          }
          //Get items by id 
          if(req.method === "GET" && id){
           const item=getItemById(id)
           res.writeHead(item? 200 :404 ,{"content-type":"application/json"})
           res.end(JSON.stringify(item || "Item not found "))
           return
          }

          //POST -Ceate a new shopping list item
          if(req.method === "POST"){
            //Stores all the pieces combined
            let body=""
            //listen for the event 
            req.on("data",(chunk)=>{
             console.log(chunk,"chunk") //chunk is a buffer (binary data)
             body+= chunk.toString() //convert it to string and add to body 
             console.log(body,"body")
            })
            req.on('end',()=>{
                try{
                const {name,quantity}=JSON.parse(body)
                if(!name){
                res.writeHead(400,{"content-type":"application/json"})
                res.end(JSON.stringify({error:"Name is required"}))
                return 
                }
                const newItem=createItem({name,quantity})
                 res.writeHead(201,{"content-type":"application/json"})
                res.end(JSON.stringify(newItem))
                }catch(error){
                    res.writeHead(400,{"content-type":"application/json"})
                        res.end(JSON.stringify({error:"Invalid JSON"}))
                }
            })
            return 
          }
          // PUT -Updaye item by id
          if(req.method === "PUT" && id){
            let body=""
            req.on("data",(chunk)=>{
                body+=chunk.toString()
            })
            req.on("end",()=>{
                try{
                    const updateData=JSON.parse(body)
                    const updatedItem=updateItem(id,updateData)
                    if(updatedItem){
                        res.writeHead(200,{"content-type":"application/json"})
                        res.end(JSON.stringify(updatedItem))
                    }
                    else{
                        res.writeHead(404,{"content-type":"application/json"})
                        res.end(JSON.stringify({error:"Item not found"}))
                    }
                }
                catch(error){
                    res.writeHead(400,{"content-type":"application/json"})
                    res.end(JSON.stringify({error:"Invalid JSON"}))
                }
            })
            return
          }
          //Delete item by id
          if(req.method === "DELETE" && id){
            const deleted=deleteItem(id)
            if(deleted){
                res.writeHead(200,{"content-type":"application/json"})
                res.end(JSON.stringify({message:"Item deleted successfully"}))
  
            }
            else{
                res.writeHead(404,{"content-type":"application/json"})
                res.end(JSON.stringify({error:"Item not found"}))
            }
            return 
          }
            res.writeHead(404,{"content-type":"application/json"})
            res.end(JSON.stringify({error:"Route not found"}))

    }
}
