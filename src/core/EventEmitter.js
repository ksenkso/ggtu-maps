export default class EventEmitter {
    _events = new Map();
    emit(event, payload) {
        if (this._events.has(event)) {
            this._events.get(event).forEach(fn => fn(payload))
        }
    }

    off(event, fn) {
        if (this._events.has(event)) {
            const events = this._events.get(event);
            events.splice(events.findIndex(fn), 1);
            this._events.set(event, events);
        }
    }

    on(event, fn) {
        if (this._events.has(event)) {
            this._events.get(event).push(fn)
        } else {
            this._events.set(event, [fn]);
        }
    }

}
