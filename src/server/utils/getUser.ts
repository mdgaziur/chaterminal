import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
import { User } from "../models/user";

export default async function getUserFromAuthToken(authToken: string) {
    let payload: any = verify(authToken, process.env.JWT_SECRET_KEY);
    return await getModelForClass(User).findOne({
        _id: payload.userId
    });
}