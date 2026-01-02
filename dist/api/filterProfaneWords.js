export function filterProfaneWords(body) {
    let words = body.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (words[i].toLowerCase() === "kerfuffle" ||
            words[i].toLowerCase() === "sharbert" ||
            words[i].toLowerCase() === "fornax") {
            words[i] = "****";
        }
    }
    return words.join(" ");
}
