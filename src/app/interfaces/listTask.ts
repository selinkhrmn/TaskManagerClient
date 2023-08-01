export interface ListTask {
    
    id: number;
    name: string;
    columnId: number;
    //kategori: string;
    assigneeId: string;
    reporterId:string;
    dueDate: Date;
    priority: number;
    updateDate:Date;
    createDate:Date;
    
    
  }