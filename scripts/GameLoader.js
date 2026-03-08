export class GameLoader {
    static path = "";
    static canvas = null;
    static $ui = null;

    static async getGame(id) {
        try {
            const res = await fetch(`${GameLoader.path}/info.json`);
            const info = await res.json();

            if (!info)
                console.warn("A lista de jogos está vazia!");

            return info.find(game => game.id === id);

        } catch (error) {
            console.error("A lista de jogos não foi encontrada! Erro: " + error);
        }
    }

    static getParam() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    static async load() {
        const id = this.getParam();
        
        if (!id) {
            alert("O jogo procurado não existe!");
            location.href = "index.html";
            return;
        }
        
        const gameInfo = await GameLoader.getGame(id);

        if (!gameInfo) {
            alert("O jogo não foi encontrado!");
            location.href = "index.html";
            return;
        }

        $(document).prop("title", `Bit Games: ${gameInfo.name}`);
        $("header h1").text(gameInfo.name);

        $("<link>", {
            rel: "stylesheet",
            href: `${GameLoader.path}/${gameInfo.slug}/main.css`
        }).appendTo("head");

        const module = await import(`../${GameLoader.path}/${gameInfo.slug}/main.js`);

        const GameClass = module.default;
        const game = new GameClass({
            name: gameInfo.name, 
            canvas: GameLoader.canvas, 
            $ui: GameLoader.$ui
        });

        await game.boot();
        game.start();
    }

    static async init(path, canvas, $ui) {
        GameLoader.path = path;
        GameLoader.canvas = canvas;
        GameLoader.$ui = $ui;
        await GameLoader.load();
    }
}
