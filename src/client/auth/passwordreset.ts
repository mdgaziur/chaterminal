import ora from "ora";
import { confirmPassword, getEmail } from "../../io/creds";
import { log, type } from "../../io/log";
import fetch, { Response } from 'node-fetch';
import { getJWTToken } from "../../io/getJWT";

export async function passwordReset(server: string) {
    log("Let's reset your password");
    while(1) {
        let email = await getEmail();

        let requestBody = {
            email
        }

		let reqUrl = server + "/auth/resetPassword/gettoken";

		let resp: Response;

		const spinner = ora("Sending email to your account email...");

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
            log("Check your email for password reset token", type.SUCCESS);
            await setNewPasswordAfterReset(server);
			break; // registration done;
		} else {
			log("Failed to reset password because of unknown errors", type.ERROR);
		}
    }
}

async function setNewPasswordAfterReset(server: string) {
    while(1) {
        let resetToken = await getJWTToken('Reset token -> ');
        let password = await confirmPassword();


        let requestBody = {
            resetToken,
            password
        }

        let reqUrl = server + "/auth/resetPassword/resetpassword";

        let resp: Response;

        const spinner = ora("Resetting your password...");

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
            log("Invalid token!", type.ERROR)
        }
        else if(!resp.ok) {
            let json = await resp.json();
            spinner.fail("One or more errors occured!");
            let errors = json.errors;
            errors.forEach(err => {
                log(`Field ${err.param}: ${err.msg}`, type.ERROR);
            });
        } else if(resp.ok){
            log("Password reset is successful!", type.SUCCESS);
            break; // registration done;
        } else {
            log("Failed to reset password because of unknown errors", type.ERROR);
        }
    }
}