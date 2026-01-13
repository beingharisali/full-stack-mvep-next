export interface Product {
    id:string;
    name:string;
    price:number;
    stock:number;
    images:string;
    description:string;
    category:string;
    brand:string;
    isActive:boolean;
    createdAt?: string;
    updatedAt?:string;

}