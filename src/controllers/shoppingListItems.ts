
import type { Item, CreateItem, UpdateItem } from '../models/items.js'

//retrieves an array of items 
let items: Item[] = []
//Initialized id to one so it can be incremented when adding items 
let nextId = 1
//get all items with their structure
export const getAllItems = (): Item[] => {
   return items
}
//gets item that matches the id given with the ones that exist in the database if they dont match dont break but make it undefined
export const getItemById = (id: number): Item | undefined => {
   return items.find((item) => item.id === id)
}
//create a new item and add it to the existing item object 
export const createItem = (input: CreateItem): Item => {
   const newItem: Item = {
      id: nextId,
      name: input.name,
      quantity: input.quantity ?? "1",
      category: input.category,
      purchased: false,
   }
   nextId++;
   items.push(newItem)
   return newItem
}
//finds an item by id if it doesn't exist then return undefined if it does exist then update it to the one provided 
export const updateItem = (id: number, updated: UpdateItem): Item | undefined => {
   const item = getItemById(id)
   if (!item) return undefined
   //only update the field if there's a value provided 
   if (updated.name !== undefined) item.name = updated.name
   if (updated.quantity !== undefined) item.quantity = updated.quantity
   if (updated.category !== undefined) item.category = updated.category
   if (updated.purchased !== undefined) item.purchased = updated.purchased
   return item
}
//deletes an item by comparing the number of items before and after also filter by item where id is not equal to the one provided 
export const deleteItem = (id: number): boolean => {
   const beforeDelete = items.length
   items = items.filter((item) => item.id !== id)
   return items.length < beforeDelete

}
