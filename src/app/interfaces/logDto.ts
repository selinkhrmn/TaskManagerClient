export interface LogDto {
    fieldName: string;
    oldValue: string;
    newValue: string;
    actionDate: Date;
    userId: string;
}

export interface LogUserDto {
    tableName: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    actionDate: Date;
    projectId: string;
}