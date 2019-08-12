import { Context } from "../Utils/Context";

export interface IDrawable
{
    Draw(context : Context) : void;
}