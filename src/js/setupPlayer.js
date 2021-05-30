import * as PIXI from "pixi.js";
import setupChat from "./setupChat";
import { sheep_area } from "./setupChat";
import {app, gameHeight, gameWidth, state} from "./game";
import { gsap } from "gsap";

let player;

export default function setupPlayer() {
    const player_img = 'https://static-cdn.jtvnw.net/emoticons/v2/1485944/default/dark/3.0';

    const loaderOptions = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
    };

    app.loader.add('player', player_img, loaderOptions).load((loader, resources) => {
        player = new PIXI.Sprite(resources.player.texture);

        player.x = gameWidth / 2;
        player.y = gameHeight / 2;

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
            if(state.screen === 'playing') {
                mouseCoords.x = app.renderer.plugins.interaction.mouse.global.x;
                mouseCoords.y = app.renderer.plugins.interaction.mouse.global.y;

                let diffx = player.x - mouseCoords.x;
                let diffy = player.y - mouseCoords.y;

                gsap.to(sheep_area, {
                    x: sheep_area.x + diffx, y: sheep_area.y + diffy, duration: 3
                });
            }
        };
    });
}

function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.sqrt( a*a + b*b );
}

export { player };