import { getTokenForUser } from "../auth/login";
import { registerUser } from "../auth/register";
import { question } from "../../io/question";

export async function getAuthToken(server: string): Promise<string> {
	let hasAccount = await question("Do you have an account?", "Y");
	if(!hasAccount) {
		await registerUser(server);
		return await getTokenForUser(server);
	} else {
		return await getTokenForUser(server);
	}
}
