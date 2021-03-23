import { isJWT } from "class-validator";
import { log, type } from "./log";
import { syncreadline } from "./syncreadline";

export async function getJWTToken(prompt: string): Promise<string> {
	let jwtToken: string;
	while (1) {
		jwtToken = await syncreadline(prompt);
        if(!isJWT(jwtToken)) {
            log("Invalid token!", type.ERROR);
        } else {
            return jwtToken;
        }
	}
}