import { IListenEvent } from '../Interface/IListenEvent';

export abstract class EventListener implements IListenEvent {
    protected static value : any;
    protected static instance : EventListener;

    protected constructor(eventType : string)
    {
        window.addEventListener(eventType, e => this.UpdateValue(e))
    }
    
    public static getInstance() : EventListener {throw new Error("You cannot get instance of an abstract class"); return null}
    public abstract getValue() : any
    protected abstract UpdateValue(e : Event) : void
}