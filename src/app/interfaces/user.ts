import { Base } from "./base";

export interface User {
    name?:  string;
    surname?: string;
    usernameOrEmail: string;
    //email: string;
    password: string;
    role?: string;
}

