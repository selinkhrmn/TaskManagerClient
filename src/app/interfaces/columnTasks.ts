import { TaskDto } from "./taskDto";
import { Column } from "./column";


export interface ColumnTask {
    name: string;
    id: number;
    tasks: TaskDto[];
}