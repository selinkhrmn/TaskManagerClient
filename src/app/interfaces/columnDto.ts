export class ColumnDto {
    id: number;
    name: string;
}

export class TransferDto{
    projectId : number;
    columnId: number;
    transferredColumnId: number;
}