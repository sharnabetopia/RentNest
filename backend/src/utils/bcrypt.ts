import bcrypt from "bcryptjs";
import config from "../config";

export const hashPassword = (password: string) => {

    return bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
);

};

export const comparePassword = (

    password:string,

    hashed:string

)=>{

    return bcrypt.compare(password,hashed);

}