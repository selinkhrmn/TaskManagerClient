import { Base } from "./base";

export interface User {
    name?:  string;
    surname?: string;
    usernameOrEmail: string;
    //email: string;
    password: string;
    role?: string;
}


export interface User1 {
      userName: string
      name : string
      surname: string
      email:string
      password :string
      role: string;
}
