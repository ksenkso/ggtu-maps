import {round} from './common';

export default class Mat3 {

    constructor() {
        this.matrix = Mat3.identity();
    }
    static identity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

    static getProjection(width, height) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ];
    }

    static multiply(m1, m2) {
        const result = Array(9).fill(0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[3 * i + j] += m1[3 * i + k] * m2[j + 3 * k];
                }
            }
        }
        return result;
    }

    static createTranslation(tx, ty) {
        return [
            1, 0, tx,
            0, 1, ty,
            0, 0, 1
        ];
    }

    static createScale(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ];
    }

    static createRotation(angle) {
        const c = round(Math.cos(angle), 4),
            s = round(Math.sin(angle), 4);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ];
    }
    getMatrix() {
        return this.matrix;
    }

    translate(tx, ty) {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createTranslation(tx, ty));
        return this;
    }

    scale(sx, sy) {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createScale(sx, sy));
        return this;
    }

    rotate(angle) {
        this.matrix = Mat3.multiply(this.matrix, Mat3.createRotation(angle));
        return this;
    }
}
