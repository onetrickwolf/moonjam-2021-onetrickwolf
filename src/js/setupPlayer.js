import * as PIXI from "pixi.js";
import setupChat from "./setupChat";
import {app, gameHeight, gameWidth} from "./game";

let player;

export default function setupPlayer() {
    const player_img = 'https://static-cdn.jtvnw.net/emoticons/v2/1485944/default/dark/3.0';

    const loaderOptions = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
    };

    app.loader.add('player', player_img, loaderOptions).load((loader, resources) => {
        player = new PIXI.Sprite(resources.player.texture);

        player.x = Math.floor(Math.random() * gameWidth);
        player.y = Math.floor(Math.random() * gameHeight);

        player.width = player.width / 2;
        player.height = player.height / 2;

        player.anchor.x = 0.5;
        player.anchor.y = 0.5;

        app.stage.addChild(player);

        setupChat();

        player.acceleration = new PIXI.Point(0);
        let mouseCoords = new PIXI.Point(20, gameHeight / 2);

        app.stage.interactive = true;
        app.stage.hitArea = app.screen;
        app.stage.mousedown = () => {
            mouseCoords.x = app.renderer.plugins.interaction.mouse.global.x;
            mouseCoords.y = app.renderer.plugins.interaction.mouse.global.y;
        };

        app.ticker.add((delta) => {
            player.acceleration.set(player.acceleration.x * 0.99, player.acceleration.y * 0.99);

            const toMouseDirection = new PIXI.Point(
                mouseCoords.x - player.x,
                mouseCoords.y - player.y,
            );

            const angleToMouse = Math.atan2(
                toMouseDirection.y,
                toMouseDirection.x,
            );

            const distMousePlayer = distanceBetweenTwoPoints(
                mouseCoords,
                player.position,
            );

            const playerSpeed = distMousePlayer * 0.05;

            player.acceleration.set(
                Math.cos(angleToMouse) * playerSpeed,
                Math.sin(angleToMouse) * playerSpeed,
            );

            player.x += player.acceleration.x * delta;
            player.y += player.acceleration.y * delta;
        });
    });
}

function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
}

export { player };