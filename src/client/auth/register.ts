import fetch, { Response } from "node-fetch";
import ora from "ora";
import { confirmPassword, getEmail, getUsername } from "../../io/creds";
import { log, type } from "../../io/log";

export async function registerUser(server: string) {
	log("Let's register");
	while (1) {
		let username = await getUsername();
		let email = await getEmail();
		let password = await confirmPassword();

		let reqUrl = server + "/auth/register";

		let requestBody = {
			username,
			email,
			password,
		};

		let resp: Response;

		const spinner = ora("Registering into the server...");

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
		if(!resp.ok) {
            let json = await resp.json();
			spinner.fail("One or more errors occured!");
			let errors = json.errors;
			errors.forEach(err => {
				log(`Field ${err.param}: ${err.msg}`, type.ERROR);
			});
		} else if(resp.ok){
            log("Registration done!", type.SUCCESS);
			break; // registration done;
		} else {
			log("Failed to create user because of unknown errors", type.ERROR);
		}
	}
}
