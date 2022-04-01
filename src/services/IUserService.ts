export interface IUserRequest {
    name: string;
    email: string;
    password: string;
    isAdm: boolean;
}

export interface UserRequestResponse {
    uuid: string
    name: string;
    email: string;
    isAdm: boolean;
    createdOn: Date;
    updatedOn: Date;
}

export interface ILogin{
    email: string, 
}