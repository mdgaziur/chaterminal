import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../models/user";

export async function userExists(username: string) {
    let userModel = getModelForClass(User);
    let user = await userModel.findOne({
        username: username
    });
    if(!user) {
        throw new Error("User does not exist!");
    }
    return username;
}

export async function userExistsUsingEmail(email: string) {
    let userModel = getModelForClass(User);
    let user = await userModel.findOne({
        email: email
    });
    if(!user) {
        throw new Error("User does not exist!");
    }
    return email;
}