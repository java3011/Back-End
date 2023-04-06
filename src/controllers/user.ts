import { Request, Response } from "express";

import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { User } from "../models/user";

export const newUser = async(req: Request, res: Response) => {

    const { username, email, charge, password } = req.body;

    //Validar existencia del usuario en BD
    const user = await User.findOne({ where: { username: username} })

   if(user){
        return res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        //Guardar usuarios en la BD
        await User.create({
            username: username,
            email: email,
            charge:charge,
            password: hashedPassword
        })
        res.json({
            msg:`Usuario ${username} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg:'Ups, ocurrio un error',
            error
        })
    }
}

export const loginUser = async(req: Request, res: Response) => {

    const { email, password } = req.body;
    
    //Validar si el usuario existe en la base de datos
    const user : any = await User.findOne({ where: { email: email} })

    if(!user){
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${email} en la base de datos`
        })
    }
    //Validar el password
    const passwordValid = await bcrypt.compare(password, user.password);
    if(!passwordValid){
        return res.status(400).json({
            msg: `Password Incorrecta`
        })
    }
    //Validar token
    const token = jwt.sign({
        email: email
    }, process.env.SECRET_KEY || 'pepito123', {
        expiresIn: '10000'
    });

    res.json(token);
}