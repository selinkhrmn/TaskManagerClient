import { UserDto } from "./user";

export interface ProjectUserDto{
    username: string; // file işlemlerinden sonra silinmesini talep ediyorum. Id ile pipe kullanmak yeterli
    id: string;
    profileImageUrl: string;

}


export interface ProjectUserList{
    users : Partial<UserDto>[];
    projectId :number;
}