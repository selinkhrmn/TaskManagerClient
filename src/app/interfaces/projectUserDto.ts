import { UserDto } from "./user";

export interface ProjectUserDto{
    // username: string; // file işlemlerinden sonra silinmesini talep ediyorum. Id ile pipe kullanmak yeterli
    id: string;
    profileImageUrl: string;
    userId: string;

}


export interface ProjectUserList{
    users : string[];
    projectId :number;
}

export interface ProjectUserListForEmail{
    users : string[];
    message :string;
}