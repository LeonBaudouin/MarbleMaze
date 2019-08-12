import { Context } from "../Utils/Context";

export interface IUpdatable
{
    Update(context : Context) : void;
}