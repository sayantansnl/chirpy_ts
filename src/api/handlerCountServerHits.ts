import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerCountServerHits(_: Request, res: Response) {
    res.set({
        "Content-Type": "text/plain"
    });
    res.send(`Hits: ${config.fileServerHits}`);
}