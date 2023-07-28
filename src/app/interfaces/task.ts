import { Base } from "./base";
import { User } from "./user";

export interface Task extends Base {
    name: string;
    projectId : number;
    columnId : number;
    priority : number;
    userUpdatedDate : Date;
    endDate : Date;
    assigneeId: string;
    reporterId : string;

}