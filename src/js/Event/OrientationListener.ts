import { EventListener } from "./EventListener";
import { IListenEvent } from "../Interface/IListenEvent";

export class DeviceOrientationListener extends EventListener {

    protected static instance : DeviceOrientationListener;
    protected static value : number = 0;

    public static getInstance()  : IListenEvent
    {    
        if(DeviceOrientationListener.instance == null)
            DeviceOrientationListener.instance = new DeviceOrientationListener()

        return DeviceOrientationListener.instance;
    }

    private constructor()
    {
        super("deviceorientation");
    }

    public getValue()
    {
        return DeviceOrientationListener.value;
    }

    public UpdateValue(e : DeviceOrientationEvent)
    {
        DeviceOrientationListener.value = e.alpha;
    }

}