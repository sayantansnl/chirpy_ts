import { getAllChirps } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
export async function handlerGetAllChirps(_, res) {
    const chirps = await getAllChirps();
    if (!chirps) {
        throw new Error("Couldn't get chirps");
    }
    respondWithJSON(res, 200, chirps);
}
