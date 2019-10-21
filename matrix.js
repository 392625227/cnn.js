

class Matrix {

    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;

        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            if (typeof this.data[i] == 'undefined') this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = (Math.random() * 2) - 1;
            }
        }
    }

    static fromArray(arr) {
        let res = new Matrix;

        res.rows = arr.length;
        res.cols = arr[0].length;

        for (let i = 0; i < res.rows; i++) {
            if (typeof res.data[i] == 'undefined') res.data[i] = [];
            for (let j = 0; j < res.cols; j++) {
                res.data[i][j] = arr[i][j];
            }
        }

        return res;
    }

    toArray() {
        return this.data;
    }

    print(div) {
        if(!div) {
            console.log("Matrix: " + this.rows + "x" + this.cols);
            console.table(this.data);
            return this;
        }
    }

    static sum(m1, m2) {
        let ret = Matrix.fromArray(m1.data);
        return ret.sum(m2);
    }

    sum(other) {
        if(this.rows != other.rows || this.cols != other.cols)
            throw("cols or rows mismatch");

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += other.data[i][j];
            }
        }
        return this;
    }

    static sub(m1, m2) {
        let ret = Matrix.fromArray(m1.data);
        return ret.sub(m2);
    }

    sub(other) {
        if(this.rows != other.rows || this.cols != other.cols)
            throw("cols or rows mismatch");

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] -= other.data[i][j];
            }
        }
        return this;
    }

    static multiply(m1, m2) {
        let ret = Matrix.fromArray(m1.data);
        return ret.multiply(m2);
    }

    multiply(other) {
        if(other instanceof Matrix) {
            if(this.cols != other.rows)
                throw("cols and rows mismatch");

            let tmp = [];
            let rows = this.rows;
            let cols = other.cols;
            let len = this.cols;

            for (let i = 0; i < rows; i++) {
                if (typeof tmp[i] == 'undefined') tmp[i] = [];
                for (let j = 0; j < cols; j++) {
                    if (typeof tmp[i][j] == 'undefined') tmp[i][j] = 0;
                    for (let x = 0; x < len; x++) {
                        tmp[i][j] += this.data[i][x] * other.data[x][j];
                    }
                }
            }

            this.rows = rows;
            this.cols = cols;
            this.data = tmp;
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= other;
                }
            }
        }

        return this;
    }

    static hadamard_multiply(m1, m2) {
        let ret = Matrix.fromArray(m1.data);
        return ret.hadamard_multiply(m2);
    }

    hadamard_multiply(other) {
        if(this.cols != other.cols || this.rows != other.rows)
            throw("cols and rows mismatch");

        let tmp = [];
        for (let i = 0; i < this.rows; i++) {
            if (typeof tmp[i] == 'undefined') tmp[i] = [];
            for (let j = 0; j < this.cols; j++) {
                tmp[i][j] = this.data[i][j] * other.data[i][j];
            }
        }
        this.data = tmp;

        return this;
    }

    static transpose(m) {
        let ret = Matrix.fromArray(m.data);
        return ret.transpose();
    }

    transpose() {
        let tmp = [];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (typeof tmp[j] == 'undefined') tmp[j] = [];
                tmp[j][i] = this.data[i][j];
            }
        }
        this.data = tmp;
        this.rows ^= this.cols;
        this.cols ^= this.rows;
        this.rows ^= this.cols;
        return this;
    }

    static map(m, func) {
        let ret = Matrix.fromArray(m.data);
        return ret.map(func);
    }

    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = func(this.data[i][j]);
            }
        }

        return this;
    }
}
