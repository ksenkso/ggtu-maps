import {ICoords} from '../utils/Vector';

export default interface IAdjacencyNode {
    marked?: boolean;
    ObjectId?: number;
    position: ICoords;
    siblings: Array<{id: string, index: number}>;
}
