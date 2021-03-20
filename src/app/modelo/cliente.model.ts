export interface Cliente{
    //Las interrogaciones quiere decir que son opcionales
    id?:string;
    nombre?:string;
    apellido?:string;
    email?:string;
    saldo?:number;
}