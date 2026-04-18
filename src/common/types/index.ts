import { HydratedDocument, HydrateOptions } from "mongoose";
import { IUser } from "../interfaces";

export type UserDocument = HydratedDocument<IUser>