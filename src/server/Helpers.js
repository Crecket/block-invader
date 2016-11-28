module.exports = {
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // calculate new point based on current x/y, the angle and speed
    findNewPoint: (x, y, angle, distance) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    },
    // calc center http://stackoverflow.com/a/2049712/4580555
    triangleCollision: (p, p0, p1, p2) => {
        var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        var sign = A < 0 ? -1 : 1;
        var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
        var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

        return s > 0 && t > 0 && (s + t) < 2 * A * sign;
    }
}