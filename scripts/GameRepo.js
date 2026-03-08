export class GameRepo {
    static path = "";
    static $container = null;
    static games = [];

    static async getGames() {
        try {
            const res = await fetch(`${GameRepo.path}/info.json`);
            const info = await res.json();

            if (!info)
                console.warn("A lista de jogos está vazia!");

            GameRepo.games = info;
            return info;

        } catch (error) {
            console.error("A lista de jogos não foi encontrada! Erro: " + error);
        }
    }

    static build() {
        GameRepo.games.forEach(game => {
            const $card = $("<a>", {href: `play.html?id=${game.id}`});
            $card.html(`
                <img src="${GameRepo.path}/${game.slug}/icon.png">
                <p>${game.name}</p>
            `);
            GameRepo.$container.append($card.clone());
        });
    }

    static async init(path, container) {
        GameRepo.path = path;
        GameRepo.$container = container;

        await GameRepo.getGames();
        GameRepo.build();
    }
}
