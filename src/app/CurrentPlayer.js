import Player from './Player';

module.exports = class CurrentPlayer {
    constructor(canvas) {
        this.canvas = canvas;

        this.player = new Player(-100, -100, this.canvas)

        this.setCenter();
    }

    setCenter = () => {
        this.player.setPosition(
            (this.canvas.width / 2) - this.player.width / 2,
            (this.canvas.height / 2) - this.player.width / 2
        )
    }

}