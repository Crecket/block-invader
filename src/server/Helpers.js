module.exports = {
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    findNewPoint: (x, y, angle, distance) => {
        return {
            x: Math.round(Math.cos((angle - 90) * Math.PI / 180) * distance + x),
            y: Math.round(Math.sin((angle - 90) * Math.PI / 180) * distance + y)
        }
    }
}