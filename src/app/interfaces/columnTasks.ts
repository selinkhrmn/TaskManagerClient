import { taskDto } from "./taskDto";
import { Column } from "./column";


export interface ColumnTask {
    name: String;
    id: number;
    tasks: taskDto[];

}