import { Base } from "./base";

export interface Project extends Base {
    name: string;
    description: string;
}

export interface ProjectDto{
    name: string;
    id: number;
    description: string;
    createdDate: Date;
}