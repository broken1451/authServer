import express from 'express';
import dotenv from "dotenv";
import Server from "./src/server/server";
import { db } from './src/db/db';
dotenv.config();


const server = new Server();
server.app.use(express.static('public'))

const conn = async () => {
    try {
     await db()
     await server.start(Number(process.env.PORT)); 
    } catch (error) {
        console.log(error)
    }
 }
 
conn();