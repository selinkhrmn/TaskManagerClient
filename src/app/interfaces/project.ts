import { Base } from "./base";

export interface Project extends Base {
    name: string;
}

export interface ProjectDto{
    name: string;
    id: number;
    createdDate: Date;
}