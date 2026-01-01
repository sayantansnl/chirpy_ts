export async function handlerReadiness(_, res) {
    res.set({
        "Content-Type": "text/plain"
    });
    res.send("OK");
}
