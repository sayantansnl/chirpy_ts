import { getAllChirps, getChirpsByAuthorId } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
export async function handlerGetAllChirps(req, res) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    const chirps = authorId ? await getChirpsByAuthorId(authorId) : await getAllChirps();
    if (!chirps) {
        throw new Error("Couldn't get chirps");
    }
    respondWithJSON(res, 200, chirps);
}
