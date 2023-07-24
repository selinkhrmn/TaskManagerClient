export interface ListTask {
    
    id: number;
    name: string;
    columnId: string;
    //kategori: string;
    assigneeId: number;
    reporterId:number;
    DueDate: Date;
    Priority: number;
    UpdateDate:Date;
    CreateDate:Date;
    
    
  }