import { EventListener } from "./EventListener";
import { IListenEvent } from "../Interface/IListenEvent";
import { DeviceOrientation } from "../Utils/DeviceOrientation";

export class OrientationListener extends EventListener {

    protected static instance : OrientationListener;
    protected static value : DeviceOrientation = {alpha: 0, beta: 0, gamma: 0};

    public static getInstance()  : OrientationListener
    {    
        if(OrientationListener.instance == null)
            OrientationListener.instance = new OrientationListener()

        return OrientationListener.instance;
    }

    private constructor()
    {
        super("deviceorientation");
    }

    public getValue() : DeviceOrientation
    {
        return OrientationListener.value;
    }

    protected UpdateValue(e : DeviceOrientationEvent)
    {
        OrientationListener.value = e;
    }

}