import { IListenEvent } from '../Interface/IListenEvent';

export abstract class EventListener implements IListenEvent {
    protected static value : any;
    protected static instance : IListenEvent;

    protected constructor(eventType : string)
    {
        window.addEventListener(eventType, e => this.UpdateValue(e))
    }
    
    public static getInstance() : IListenEvent {throw new Error("You cannot get instance of an abstract class"); return null}
    abstract getValue() : any
    abstract UpdateValue(e : Event) : void
}