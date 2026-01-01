import { config } from "../config.js";
export async function handlerReset(_, res) {
    config.fileServerHits = 0;
    res.write("Hits set back to 0.");
    res.end();
}
