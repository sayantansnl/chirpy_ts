import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerReset(_, res) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Forbidden action");
    }
    await deleteUsers();
    config.api.fileServerHits = 0;
    res.write("Hits set back to 0.");
    res.end();
}
