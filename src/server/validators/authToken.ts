import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
import { User } from "../models/user";

export default async function isValidAuthToken(authToken: string): Promise<Boolean> {
    try {
        let payload: any = verify(authToken, process.env.JWT_SECRET_KEY);
        let userId = payload.userId;
        let user = await getModelForClass(User).findOne({
            _id: userId
        });
        if(user) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}