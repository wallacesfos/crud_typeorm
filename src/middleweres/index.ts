import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import { getRepository } from 'typeorm';
import { User } from '../entities/User'

export interface TokenInterface {
  user: {
     id: string;
     name: string;
     isAdm: boolean;
  };
}


export const validate = (schema: any) => async (request : Request, response : Response, next: NextFunction) => {
    const resource = request.body;

    try{
        await schema.validate(resource);
        next();
    }catch (e: any) {
        response.status(400).json({ error: e.errors.join(", ") });
    }
}

export const authenticate = (request: Request, response: Response, next: NextFunction) => {
  if(!request.headers.authorization){
    return response.status(401).json({ message: "invalid token."});
  }
  const token = request.headers.authorization.split(" ")[1];
  
  jwt.verify(token, 'kenzinhosecretsnuncavaidescbrirporqueasenhaéenorme123', (err) => {
      if(err){
        return response.status(401).json({ message: "invalid token."})
      }
  });

  next()
};


export const authenticateAdmin = async (request: Request, response: Response, next: NextFunction) => {
    if (!request.headers.authorization) {
      return response.status(401).json({ message: "invalid token."});
    }
  
    let token = request.headers.authorization.split(" ")[1];
  
    const deco : any = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      return decoded
    });

    if (!deco.isAdm) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    next()
};

export const authenticateAdminDeletePatch = async (request: Request, response: Response, next: NextFunction) => {
  const { uuid } = request.params

  if (!request.headers.authorization) {
    return response.status(401).json({ message: "invalid token."});
  }

  let token = request.headers.authorization.split(" ")[1];

  const deco : any = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    return decoded
  });

  if (!deco.isAdm && deco.id !== uuid) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  next()
};

export const existsUser = async (request: Request, response: Response, next: NextFunction) => {
  const { uuid } = request.params;

  const repo = getRepository(User)

  const user = await repo.find({id: uuid})

  if(user[0] === undefined){
    return response.status(404).json({messagse: "user not found"})
  }

  next()
 
}