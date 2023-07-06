export class ResponseModel <T>{
    message: string;
    isSuccessful: boolean;
    data: T[];
}