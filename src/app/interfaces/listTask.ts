export interface ListTask {
    
    id: number;
    name: string;
    columnId: number;
    //kategori: string;
    assigneeId: string;
    reporterId:string;
    dueDate: Date;
    priority: number;
    updatedDate:Date;
    createdDate:Date;
    isDone: boolean;
    createdByUser: string;
    label: number;
    
    
  }