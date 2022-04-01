import {Entity, PrimaryColumn, Column, CreateDateColumn} from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity('users')
export class User {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password : string;
    
    @Column()
    isAdm : boolean;
    
    @CreateDateColumn()
    createdOn : Date;

    @CreateDateColumn()
    updatedOn : Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }

}
