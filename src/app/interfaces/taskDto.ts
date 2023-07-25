import { User } from "./user";

export class taskDto {
    id: number;
    name: string;
    columnId: number;
    priority: number;
    user : User;
}