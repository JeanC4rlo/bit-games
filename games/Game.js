export class Game {
    constructor({ name, canvas, $ui }) {
        this.name = name;
        this.canvas = canvas;
        this.$ui = $ui;
    }

    start() { }
    update(dt) { }
    render() { }
    resize() {
        requestAnimationFrame(() => {
            const parent = this.canvas.parentElement;

            const width = parent.getBoundingClientRect().width;
            const height = parent.getBoundingClientRect().height;

            this.canvas.width = width;
            this.canvas.height = height;
        });
    }
    async boot() {
        this.resize();
        $(window).on("resize", () => this.resize());
    }
}