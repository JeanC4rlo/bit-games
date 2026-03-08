import { Game } from "../Game.js";

export default class TicTacToe extends Game {
    constructor(props) {
        super(props);

        this.turno = TicTacToe.X;
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ]
    }

    static X = "X";
    static O = "O";

    start() {
        const base = new URL('.', import.meta.url);

        let $game = $("<div>", { class: "game" });
        for (let i = 0; i < 3; i++) {
            let $line = $("<div>", { class: "line" });

            for (let j = 0; j < 3; j++) {
                let $block = $("<div>", {
                    class: "block",
                    src: `${base}/assets/blank.png`,
                    "data-row": i,
                    "data-col": j
                });

                let $img = $("<img>", {
                    src: `${base}/assets/blank.png`
                }).appendTo($block);

                $block.appendTo($line);

                this.holding = false;
            }

            $line.appendTo($game);
        }

        $game.appendTo(this.$ui);
        this.setEvents();
    }

    setEvents() {
        const $lines = $(".game").children();

        $lines.each((i, line) => {
            const $blocks = $(line).children();

            $blocks.each((j, block) => {
                const $block = $(block);
                const $img = $block.find("img");

                $block.on("mouseenter", () => {
                    if (!this.holding) this.animateEnter($img);
                });
                $block.on("mouseleave", () => {
                    if (!this.holding) this.animateLeave($img);
                });

                $block.on("mousedown", () => {
                    this.holding = true;
                    this.animateDown($img);
                });

                $block.on("mouseup", () => {
                    this.holding = false;
                    this.animateUp($img);
                    this.round($block);
                });
            });
        });
    }

    animate($img, frames, i = 0) {
        if (i >= frames.length) return;

        $img.attr("src", frames[i].src);

        setTimeout(() => {
            this.animate($img, frames, i + 1);
        }, frames[i].time);
    }

    animateEnter($img) {
        const base = new URL('.', import.meta.url);

        if (this.turno == TicTacToe.X) {
            const framesX = [
                { src: `${base}/assets/x1.png`, time: 80 },
                { src: `${base}/assets/x2.png`, time: 120 },
            ];

            this.animate($img, framesX);
        }
        else {
            const framesO = [
                { src: `${base}/assets/o1.png`, time: 80 },
                { src: `${base}/assets/o2.png`, time: 120 },
            ];

            this.animate($img, framesO);
        }
    }

    animateLeave($img) {
        const base = new URL('.', import.meta.url);

        if (this.turno == TicTacToe.X) {
            const framesX = [
                { src: `${base}/assets/x2.png`, time: 60 },
                { src: `${base}/assets/x1.png`, time: 40 },
                { src: `${base}/assets/blank.png`, time: 0 },
            ];

            this.animate($img, framesX);
        }
        else {
            const framesO = [
                { src: `${base}/assets/o1.png`, time: 60 },
                { src: `${base}/assets/o2.png`, time: 40 },
                { src: `${base}/assets/blank.png`, time: 0 },
            ];

            this.animate($img, framesO);
        }
    }

    animateDown($img) {
        const base = new URL('.', import.meta.url);

        if (this.turno == TicTacToe.X) {
            const framesX = [
                { src: `${base}/assets/x3.png`, time: 0 },
            ];

            this.animate($img, framesX);
        }
        else {
            const framesO = [
                { src: `${base}/assets/o3.png`, time: 0 },
            ];

            this.animate($img, framesO);
        }
    }

    animateUp($img) {
        const base = new URL('.', import.meta.url);

        if (this.turno == TicTacToe.X) {
            const framesX = [
                { src: `${base}/assets/x4.png`, time: 0 },
            ];

            this.animate($img, framesX);
        }
        else {
            const framesO = [
                { src: `${base}/assets/o4.png`, time: 0 },
            ];

            this.animate($img, framesO);
        }
    }

    animateClear($img) {
        const base = new URL('.', import.meta.url);

        const frames = [
            { src: `${base}/assets/pressed.png`, time: 300 },
            { src: `${base}/assets/blank.png`, time: 0 },
        ]

        this.animate($img, frames);
    }

    round($block) {
        const row = $block.attr("data-row");
        const col = $block.attr("data-col");

        this.board[row][col] = this.turno;
        $block.addClass("active");
        $block.off();

        this.check();

        if (this.turno === TicTacToe.X)
            this.turno = TicTacToe.O;
        else
            this.turno = TicTacToe.X;
    }

    check() {
        const lines = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],

            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],

            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ]

        for(const line of lines) {
            let b0 = this.board[line[0][0]][line[0][1]];
            let b1 = this.board[line[1][0]][line[1][1]];
            let b2 = this.board[line[2][0]][line[2][1]];

            if(b0 && b0 === b1 && b1 === b2) {
                console.log("Vencedor: " + b0);
                this.clear();
            }
        }
    }

    clear() {
        const $lines = $(".game").children();

        $lines.each((i, line) => {
            const $blocks = $(line).children();
            $blocks.each((j, block) => {
                $(block).removeClass("active");
                const $img = $(block).find("img");

                const index = (i * 3) + j;
                setTimeout(() => {
                    this.animateClear($img);
                }, index * 100);
            });
        });

        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ]

        setTimeout(() => {
            this.setEvents();
        }, 1100);
    }
}
