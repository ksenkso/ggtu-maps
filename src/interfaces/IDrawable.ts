import IMap from './IMap';

export default interface IDrawable {
    appendTo(scene: IMap): void;
}
