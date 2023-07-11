import { Base } from "./base";

export interface Task {
    name: string;
    projectId? : number;
    columnId? : number;
    priority? : number;
    userUpdatedDate? : Date;
    endDate? : Date;
}