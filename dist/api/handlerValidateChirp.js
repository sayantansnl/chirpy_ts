import { respondWithError, respondWithJSON } from "./json.js";
export async function handlerValidateChirp(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    let params;
    req.on("end", () => {
        try {
            params = JSON.parse(body);
        }
        catch (err) {
            respondWithError(res, 400, "Invalid JSON");
            return;
        }
        const maxLength = 140;
        if (params.body.length >= 140) {
            respondWithError(res, 400, "Chirp is too long");
            return;
        }
        respondWithJSON(res, 200, { valid: true });
    });
}
