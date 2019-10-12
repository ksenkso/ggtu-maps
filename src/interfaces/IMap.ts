import IApiClient from './IApiClient';

export default interface IMap {
    app: PIXI.Application;
    api: IApiClient;
    root: HTMLElement;
}
