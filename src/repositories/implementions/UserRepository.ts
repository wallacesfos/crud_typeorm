import { IData, IUpdateData, IUserRepository, IUserRequestResponse } from "../IUserRepository";
import { getRepository } from 'typeorm';
import { User } from '../../entities/User'

export class UserRepository implements IUserRepository{

    async save({name, email, password, isAdm} : IData) : Promise<IUserRequestResponse | Error>{
        const repo = getRepository(User);

        if(await repo.findOne({email})){
            return new Error("E-mail already registered");
        }

        const user = repo.create({
            name,
            email,
            password,
            isAdm
        });

        await repo.save(user);

        return {
            uuid: user.id,
            name: user.name,
            email: user.email,
            isAdm: user.isAdm,
            createdOn: user.createdOn,
            updatedOn: user.updatedOn
        };
    }

    async login(email : string) : Promise<User | Error>{
        const repo = getRepository(User)

        const user = await repo.findOne({email})
        
        if(!user){
            return new Error("E-mail not already registered");
        }

        return user
    }

    async findOne(id: any): Promise<any>{
        const repo = getRepository(User)
        const users = await repo.findOne({id: id})
        return {
            uuid: users.id,
            name: users.name,
            email: users.email,
            isAdm: users.isAdm,
            createdOn: users.createdOn,
            updatedOn: users.updatedOn 
        };
    }

    async delete(id: any, paramId: any): Promise<string | Error>{
        const repo = getRepository(User);

        const user = await repo.findOne({id: id})

        if(user.id === undefined){
            return new Error("User Not Found")
        }

        if(id === user.id && paramId === id){
            await repo.delete({id: id})
            return "User deleted with success"
        }
        
        if(user.isAdm === true){
            const userDelete = await repo.find({id: paramId})

            if(userDelete[0].id === undefined){
                return new Error("User Not Found")
            }

            await repo.delete({id: paramId})

            return "User deleted with success"
        }

    }

    async findAll(): Promise<any[]>{
        const repo = getRepository(User)

        const user = await repo.find()

        let newArr = []

        user.map((item) => {
            newArr.push({
                uuid: item.id,
                name: item.name,
                email: item.email,
                isAdm: item.isAdm,
                createdOn: item.createdOn,
                updatedOn: item.updatedOn
            })
        })

        return newArr
    }

    async update(id: string, paramId: string, {name, email, password}: IUpdateData): Promise<any>{
        const repo = getRepository(User)

        const user = await repo.findOne(paramId)

        user.name = name? name : user.name
        user.email = email? email: user.email
        user.password = password? password: user.password
        user.updatedOn = new Date();

        await repo.save(user)

        return {
            uuid: user.id,
            name: user.name,
            email: user.email,
            isAdm: user.isAdm,
            updateOn: user.updatedOn,
            createdOn: user.createdOn,
        }
    }   

}