import { Base } from "./base";

export interface Column extends Base{
    name: string;
    projectId: number;
}