import fetch, { Response } from "node-fetch";
import { log, type } from "../../io/log";
import ora from "ora";
import { getPassword, getUsername } from "../../io/creds";

export async function getTokenForUser(server: string): Promise<string> {
	log("Let's log in!");
	while (1) {
		let username = await getUsername();
		let password = await getPassword();

		let reqUrl = server + "/auth/login";
		let requestBody = {
			username,
			password,
		};
		const spinner = ora("Logging into the server...");
		let resp: Response;
		try {
			resp = await fetch(reqUrl, {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch {
			spinner.fail("Server error, try again.");
			log("Failed to connect to server!", type.ERROR);
			continue;
		}
		if(resp.status === 403) {
			log("Wrong Password!", type.ERROR);
		}
		else if(!resp.ok) {
			let json = await resp.json();
			spinner.fail("One or more errors occured!");
			let errors = json.errors;
			errors.forEach(err => {
				log(`Field ${err.param}: ${err.msg}`, type.ERROR);
			});
		} else if(resp.ok){
			let json = await resp.json();
			log("Login successful!", type.SUCCESS);
			return json.token;
		} else {
			log("Failed to create user because of unknown errors", type.ERROR);
		}
	}
}
