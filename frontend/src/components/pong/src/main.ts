import { Pong } from "./Pong";
import { Renderer } from "./Renderer";

window.addEventListener("load", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const game = new Pong(800, 600);
    game.start();
    const renderer = new Renderer(canvas);

    const loop = () => {
        game.update(); // update game state
        renderer.draw(game.getGameState()); // draw current state
        requestAnimationFrame(loop);
    };

    loop();
});