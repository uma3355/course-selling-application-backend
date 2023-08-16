export  interface CourseRequestBody{
    title?:string;
    description?:string;
    price?:number;
    imageLink?:string;
    published?:boolean
}

export interface CreateUserRequestBody{
    username?:string,
    password?:string
}