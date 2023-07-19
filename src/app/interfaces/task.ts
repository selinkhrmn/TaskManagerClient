import { Base } from "./base";

export interface Task extends Base {
    name: string;
    projectId : number;
    columnId : number;
    priority : number;
    userUpdatedDate : Date;
    endDate : Date;
}