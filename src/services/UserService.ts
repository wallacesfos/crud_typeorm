import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/implementions/UserRepository";
import { ILogin, IUserRequest, UserRequestResponse } from "./IUserService";



export class UserService {

    async create({name, email, password, isAdm}: IUserRequest) : Promise<UserRequestResponse | Error> {
        
        const user = await new UserRepository().save({name, email, password, isAdm})

        return user
    }

    async login({email} : ILogin) : Promise<any>{
        
        const user = await new UserRepository().login(email)

        return user
    } 

    async find(): Promise<any[]>{
        const users = await new UserRepository().findAll()

        return users
    }

    async findOne(token: string): Promise<any>{
        const jwtUser = await this.decodifyToken(token)
        const user = await new UserRepository().findOne(jwtUser)

        return user
    }

    async delete(token: string, paramId: string) : Promise<string | Error>{
        const jwtUser = await this.decodifyToken(token)
        const retornos = await new UserRepository().delete(jwtUser, paramId)

        return retornos
    }

    async update(token: string, paramId: string, data: {email?: string, name?: string, password?: string}) : Promise<any>{
        const repo = getRepository(User)
        const idJwt = await this.decodifyToken(token)
        const isAdm = await this.decodifyIsAdm(token)

        const user = data.email? await repo.find({email: data.email}) : null

        if(user !== null){
            if(user[0] !== undefined){
                return new Error("Email alredy exists")
            }
        }

        if(paramId === idJwt || isAdm === true){
            const resp = await new UserRepository().update(idJwt, paramId, data)
            return resp
        }

        return new Error("Missing admin permissions")
    }

    async decodifyToken(token: string) : Promise<any>{
        const decod = jwt.verify(token, process.env.SECRET_KEY, (err, decoded: any) => {
            return decoded.id
        });
        return decod
    }

    async decodifyIsAdm(token: string) : Promise<any>{
        const decod = jwt.verify(token, process.env.SECRET_KEY, (err, decoded: any) => {
            return decoded.isAdm
        });
        return decod
    }

}