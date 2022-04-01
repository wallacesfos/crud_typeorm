import { User } from "../entities/User";

export interface IUserRepository {
    save : (data: IData) => Promise<IUserRequestResponse | Error>
    login : (email: string) => Promise<User | Error>
    findAll: () => Promise<any[]>
    findOne: (id: any) => Promise<any>
    delete: (token: any, paramId: any) => Promise<string | Error>
    update: (id: string, paramId: string, data: IUpdateData) => Promise<any>
}

export interface IData{
    name: string;
    email: string;
    password: string;
    isAdm: boolean;
}

export interface IUserRequestResponse {
    uuid: string
    name: string;
    email: string;
    isAdm: boolean;
    createdOn: Date;
    updatedOn: Date;
}

export interface IUpdateData{
    name?: string;
    email?: string;
    password?: string;
}
