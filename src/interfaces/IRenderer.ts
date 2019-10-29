import {ILocation} from './ILocation';

export default interface IRenderer {
    renderLocation(location: ILocation): Promise<void>;
}
