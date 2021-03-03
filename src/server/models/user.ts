import { prop } from "@typegoose/typegoose";
import { isEmail } from 'class-validator';

export class User {
    @prop({
        maxlength: 25,
        minlength: 1,
        required: true
    })
    public username: string;
    @prop({
        validate: {
            validator: (e) => {
                return isEmail(e);
            }
        }
    })
    public email: string;
    @prop()
    public password: string;
}