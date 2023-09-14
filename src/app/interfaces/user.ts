import { Base } from "./base";

export interface User {
    id?: number;
    name?:  string;
    surname?: string;
    usernameOrEmail: string;
    // email: string;
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

export interface UserDto{
    selected?: unknown;
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    role: string;
    isConnected: boolean;
    status: boolean;
}


export interface UserActionDto{
    userId: string
    roleId: string
}


export interface UserConnection {
    connectionId: string,
    id: string
}
export interface DeleteUserDto{
    userId: string;
    projectId: number;
    assigneeId: string;
    reporterId: string;
}

export interface UserProfilPhoto {
    userId : string;
    path: string;
}