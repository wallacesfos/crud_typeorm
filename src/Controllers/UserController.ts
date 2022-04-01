import { Request, Response } from "express";
import { UserService } from '../services/UserService'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export class UserController{

    async createUser(request: Request, response: Response) : Promise <Response>{
        const { name, email, password, isAdm } = request.body;

        const service = new UserService();

        const hashPassword = await bcrypt.hash(password, 10)

        const result = await service.create({name, email, password: hashPassword, isAdm});

        if(result instanceof Error){
            return response.status(400).json({error: result.message});
        }

        return response.status(201).json(result);
    }

    async loginUser(request: Request, response: Response) : Promise<Response>{
        const { email, password } = request.body;
        
        const user = await new UserService().login({email})

        if(user instanceof Error){
            return response.status(404).json({error: user.message});
        }

        if (!await bcrypt.compare(password, user.password)) {
            return response.status(401).json({ message: "Wrong credentials. Try again!" });
        }

        return response.status(200).json({access_token: jwt.sign({id: user.id, name: user.name, isAdm: user.isAdm}, process.env.SECRET_KEY, {expiresIn: "1h",})});
    }

    async findUser(request: Request, response: Response) : Promise<Response>{

        const users = await new UserService().find()

        return response.status(200).json(users)
    }

    async findOneUser(request: Request, response: Response): Promise<Response>{

        const token = request.headers.authorization.split(' ')[1]

        const user = await new UserService().findOne(token)

        return response.status(200).json(user)
    }

    async deleteUser(request: Request, response: Response): Promise<Response>{
        const { uuid } = request.params

        const token = request.headers.authorization.split(' ')[1]

        const verifys = await new UserService().decodifyToken(token)
        const verifysIsAdm = await new UserService().decodifyIsAdm(token)

        if(verifys !== uuid && verifysIsAdm !== true){
            return response.status(401).json({message: "Missing admin permissions"})
        }

        await new UserService().delete(token, uuid)


        return response.status(200).json({message: "User deleted with success"})
    }

    async updateUser(request: Request, response: Response) : Promise<Response>{
        const { uuid } = request.params;

        const token = request.headers.authorization.split(' ')[1];

        const service = await new UserService().update(token, uuid, request.body)

        if(service instanceof Error){
            return response.status(401).json({message: service.message});
        }

        return response.status(200).json(service);
    }
}