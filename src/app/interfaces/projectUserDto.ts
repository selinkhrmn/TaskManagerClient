import { UserDto } from "./user";

export interface ProjectUserDto{
    username: string;
    id: string;
    profileImageUrl: string;

}


export interface AddProjectUser{
    users : Partial<UserDto>[];
    projectId :number;
}