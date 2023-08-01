import { User } from "./user";

export class taskDto {
    id: number;
    name: string;
    columnId: number;
    priority: number;
    assignee : User;
}

export class TaskUserDto {
    id : number;
    name : string;
    projectId : number;
    priority : number;
    assigneeId : string;
}