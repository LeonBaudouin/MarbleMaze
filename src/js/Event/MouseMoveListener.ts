import { EventListener } from "./EventListener";
import { Point } from '../Utils/Point';

export class MouseMoveListener extends EventListener {

    protected static instance : MouseMoveListener;
    protected static value : Point;

    public static getInstance()  : MouseMoveListener
    {    
        if(MouseMoveListener.instance == null)
            MouseMoveListener.instance = new MouseMoveListener()

        return MouseMoveListener.instance;
    }

    private constructor()
    {
        MouseMoveListener.value = new Point(0, 0);
        super("mousemove");
    }

    public getValue() : Point
    {
        return MouseMoveListener.value;
    }

    protected UpdateValue(e : MouseEvent)
    {
        MouseMoveListener.value = new Point(e.clientX, e.clientY);
    }

}