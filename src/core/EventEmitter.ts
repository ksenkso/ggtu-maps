import IEventEmitter from '../interfaces/IEventEmitter';
import {TFunction} from '../utils/common';

export default class EventEmitter implements IEventEmitter {
    private _events = new Map<string, Array<TFunction>>();
    public emit(event: string, payload?: any): void {
        if (this._events.has(event)) {
            this._events.get(event).forEach(fn => fn(payload))
        }
    }

    public off(event: string, fn: TFunction): void {
        if (this._events.has(event)) {
            const events = this._events.get(event);
            events.splice(events.findIndex(fn), 1);
            this._events.set(event, events);
        }
    }

    public on(event: string, fn: TFunction): void {
        if (this._events.has(event)) {
            this._events.get(event).push(fn)
        } else {
            this._events.set(event, [fn]);
        }
    }

}
