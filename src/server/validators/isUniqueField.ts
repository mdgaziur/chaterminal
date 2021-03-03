import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../models/user";

export async function isUniqueUsername(value) {
    let userModel = getModelForClass(User);
    let user = await userModel.findOne({
        username: value
    });
    if(user) {
        throw new Error("Username must be unique!");
    }
    else {
        return value;
    }
}
export async function isUniqueEmail(value) {
    let userModel = getModelForClass(User);
    let user = await userModel.findOne({
        email: value
    });
    if(user) {
        throw new Error("Email must be unique!");
    }
    else {
        return value;
    }
}