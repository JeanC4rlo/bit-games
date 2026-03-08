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
                    if (!$block.data("holding")) this.animateEnter($img);
                });
                $block.on("mouseleave", () => {
                    if (!$block.data("holding")) this.animateLeave($img);
                });

                $block.on("pointerdown", () => {
                    $block.data("holding", true);
                    this.animateDown($img);

                    $block.off("pointerleave");

                    $block.on("pointerleave", () => {
                        $block.data("holding", false);
                        this.animateClear($img);
                        $block.off("pointerleave");
                    });
                });

                $block.on("pointerup", () => {
                    $block.data("holding", false);
                    $block.off("pointerleave");
                    this.animateUp($img);
                    this.round($block);
                });
            });
        });
    }

    animate($img, frames, i = 0) {
        const prevTimer = $img.data("animTimer");
        if (prevTimer) clearTimeout(prevTimer);

        if (i >= frames.length) return;

        $img.attr("src", frames[i].src);

        const timer = setTimeout(() => {
            this.animate($img, frames, i + 1);
        }, frames[i].time);

        $img.data("animTimer", timer);
    }

    animateClear($img) {
        if ($img.data("animTimer")) {
            clearTimeout($img.data("animTimer"));
        }

        const base = new URL('.', import.meta.url);
        $img.attr("src", `${base}/assets/blank.png`);
    }

    animateEnter($img) {
        const base = new URL('.', import.meta.url);
        this.animateClear($img);
        clearTimeout(this.actualAnim);

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
        this.animateClear($img);

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
        this.animateClear($img);

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
        this.animateClear($img);

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

    animateReset($img) {
        const base = new URL('.', import.meta.url);
        this.animateClear($img);

        const frames = [
            { src: `${base}/assets/pressed.png`, time: 300 },
            { src: `${base}/assets/blank.png`, time: 0 },
        ]

        this.animate($img, frames);
    }

    round($block) {
        const row = Number($block.attr("data-row"));
        const col = Number($block.attr("data-col"));

        this.board[row][col] = this.turno;
        $block.addClass("active");
        $block.off("mouseenter mouseleave mousedown mouseup touchstart touchend");

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

        for (const line of lines) {
            let b0 = this.board[line[0][0]][line[0][1]];
            let b1 = this.board[line[1][0]][line[1][1]];
            let b2 = this.board[line[2][0]][line[2][1]];

            if (b0 && b0 === b1 && b1 === b2) {
                console.log("Vencedor: " + b0);
                this.animateClear();
                return;
            }
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!this.board[i][j])
                    return;
            }
        }

        console.log("Velha!");
        this.reset();
    }

    reset() {
        const $lines = $(".game").children();

        $lines.each((i, line) => {
            const $blocks = $(line).children();
            $blocks.each((j, block) => {
                $(block).removeClass("active");
                $(block).off("mouseenter mouseleave mousedown mouseup touchstart touchend");
                const $img = $(block).find("img");

                const index = (i * 3) + j;
                setTimeout(() => {
                    this.animateReset($img);
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
