export default interface IEventEmitter {
    on(event: string, fn: (...args: any[]) => any): void
    off(event: string, fn: (...args: any[]) => any): void
    emit(event: string, payload?: any): void;
}
