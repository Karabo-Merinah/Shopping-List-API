export interface Item{
    id:number,
    name:string,
    quantity:string,
    purchased:boolean,
    createdAt:string,
    updatedAt:string
}
export type CreateItem={
 name:string,
 quantity?:string,
}
export type UpdateItem={
    name?:string,
    quantity?:string,
    purchased?:boolean 
}