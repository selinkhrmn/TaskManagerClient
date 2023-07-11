import { taskDto } from "./taskDto";



export interface ColumnTask {
    name: String;
    id: number;
    tasks: taskDto[];
}