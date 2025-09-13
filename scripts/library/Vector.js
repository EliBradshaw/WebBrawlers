export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /** Adds vector v to this vector */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /** Subtracts vector v from this vector */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /** Returns a new vector that is the sum of this and v */
    with(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /** Returns a new vector that is the difference of this and v */
    without(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /** Scales this vector by s */
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /** Sets this vector to have the same values as vec */
    take(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /** Returns a copy of this vector */
    clone() {
        return new Vector(this.x, this.y);
    }

    /** Returns the magnitude of this vector */
    getMag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}