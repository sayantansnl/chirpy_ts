import { config } from "../config.js";
export async function handlerCountServerHits(_, res) {
    res.set({
        "Content-Type": "text/plain"
    });
    res.send(`Hits: ${config.fileServerHits}`);
}
