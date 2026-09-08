export interface Item{
    id:number,
    name:string,
    quantity:string,
    category:string,
    purchased:boolean,

}
export type CreateItem={
 name:string,
 quantity:string,
 category:string
}
export type UpdateItem={
    name?:string,
    quantity?:string,
    category?:string,
    purchased?:boolean 
}
