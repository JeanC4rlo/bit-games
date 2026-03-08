export class Game {
    constructor({name, canvas, $ui}) {
        this.name = name;
        this.canvas = canvas;
        this.$ui = $ui;
    }

    start() {}
    update(dt) {}
    render() {}
    resize() {
        const parent = this.canvas.parentElement;

        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    async boot() {
        this.resize();
        $(window).on("resize", () => this.resize());
    }
}