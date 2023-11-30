import { MongooseError } from "mongoose";
import jwt from "jsonwebtoken";

import dbConnection from "../utils/database.js";
import User from "../models/user.js";
import { } from 'dotenv/config';

export const all = async () => {
    await dbConnection();
    const user = await User.find();
    return user;
}

export const me = async (id) => {
    await dbConnection();
    const user = await User.findById(id);

    return user;
}

export const login = async (user) => {
    await dbConnection();

    const userLogged = await User.findOne({ email: user.email });

    if (userLogged.nome != null) {

        if (userLogged.senha == user.senha) {
            
            const secret = process.env.SECRET;

            try {
                const token = jwt.sign({
                    id: userLogged._id.toString()
                }, secret, {
                    expiresIn: "60s"
                });
                return { id: userLogged._id, token: token };

            } catch (err) {
                console.log(err);
            }
        } else {
            return new MongooseError("Senha inválida!");
        }

    } else {
        return new MongooseError("Usuário não encontrado!");
    }
}

export const create = async (user) => {
    await dbConnection();
    const createdUser = await User.create(user);
    const secret = process.env.SECRET;

    try {
        const token = jwt.sign({
            id: createdUser._id.toString()
        }, secret, {
            expiresIn: "60s"
        });
        return { id: createdUser._id, token: token };

    } catch (err) {
        console.log(err);
    }
}
