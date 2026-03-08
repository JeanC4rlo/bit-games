const params = new URLSearchParams(window.location.search);
const game = params.get("id");
const baseFolder = "games";

if(game == null) {
    window.alert("O jogo procurado não existe no site!");
    window.location.href = "index.html";
}
