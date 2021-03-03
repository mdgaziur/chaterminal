import fetch, { Response } from "node-fetch";

export default async function getUserNameFromAuthToken(server: string, authToken: string): Promise<string> {
    let reqUrl = server + "/query/username";
    let requestBody = {
        authToken
    };
    let resp: Response;
    try {
        resp = await fetch(reqUrl, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch {}
    if(resp.ok) {
        let json = await resp.json();
        let username = json.username;
        return username;
    }
}