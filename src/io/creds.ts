import { isEmail } from "class-validator";
import { validatePassword } from "../client/validators/password";
import { validateUsername } from "../client/validators/username";
import { getPass } from "./getPass";
import { log, type } from "./log";
import { syncreadline } from "./syncreadline";



export async function getUsername(): Promise<string> {
	let username: string;
	while (1) {
		username = await syncreadline("Username -> ");
		if (!validateUsername(username)) {
			log("Invalid Username!", type.ERROR);
		} else {
			return username;
		}
	}
}

export async function getEmail(): Promise<string> {
	let email: string;
	while(1) {
		email = await syncreadline("Email -> ");
		if(!isEmail(email)) {
			log("Invalid email!", type.ERROR);
		}
		else {
			return email;
		}
	}
}

export async function getPassword(prompt?: string): Promise<string> {
	let password: string;
	while (1) {
		password = await getPass(prompt || "Password -> ");
		if (!validatePassword(password)) {
			log("Invalid Password!", type.ERROR);
		} else {
			return password;
		}
	}
}


export async function confirmPassword() {
	let password: string;
	while(1) {
		password = await getPassword();
		let confirmPassword = await getPassword("Confirm Password -> ");
		if(password !== confirmPassword) {
			log("Passwords don't match!", type.ERROR);
		} else {
			return password;
		}
	}
}