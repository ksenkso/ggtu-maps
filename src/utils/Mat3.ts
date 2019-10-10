import {round} from './common';

export type TMatrix = Array<number>
export default class Mat3 {
    private matrix: TMatrix;

    constructor() {
        this.matrix = Mat3.identity();
    }
    public static identity(): TMatrix {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

    public static getProjection(width: number, height: number) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    }

    public static multiply(m1: TMatrix, m2: TMatrix): TMatrix {
        const result: TMatrix = Array(9).fill(0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[3 * i + j] += m1[3 * i + k] * m2[j + 3 * k];
                }
            }
        }
        return result;
    }

    public static createTranslation(tx: number, ty: number): TMatrix {
        return [
            1, 0, tx,
            0, 1, ty,
            0, 0, 1
        ];
    }

    public static createScale(sx: number, sy: number): TMatrix {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ];
    }

    public static createRotation(angle: number): TMatrix {
        const c = round(Math.cos(angle), 4),
            s = round(Math.sin(angle), 4);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ];
    }
    public getMatrix(): TMatrix {
        return this.matrix;
    }

    public translate(tx: number, ty: number): this {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createTranslation(tx, ty));
        return this;
    }

    public scale(sx: number, sy: number): this {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createScale(sx, sy));
        return this;
    }

    public rotate(angle: number): this {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createRotation(angle));
        return this;
    }
}
