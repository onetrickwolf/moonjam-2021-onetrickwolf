import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'
import setupStats from './setupStats';
import setupChat from './setupChat';

// Game

const gameWidth = 1280;
const gameHeight = 720;

const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
    resolution: window.devicePixelRatio,
});

document.body.appendChild(app.view);

function setupPlayer() {
    const player_img = 'https://static-cdn.jtvnw.net/emoticons/v2/1485944/default/dark/3.0';

    const loaderOptions = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
    };

    let player;

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

        app.ticker.add((delta) => {
            player.acceleration.set(player.acceleration.x * 0.99, player.acceleration.y * 0.99);

            const mouseCoords = app.renderer.plugins.interaction.mouse.global;

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

setupPlayer();

// let bunny;
//
// app.loader.add('bunny', bunny_png).load((loader, resources) => {
//     bunny = new PIXI.Sprite(resources.bunny.texture);
//     bunny.x = gameWidth / 2;
//     bunny.y = gameHeight / 2;
//     bunny.anchor.x = 0.5;
//     bunny.anchor.y = 0.5;
//
//     const basicText = new PIXI.Text('Basic text in pixi');
//     basicText.x = 50;
//     basicText.y = 100;
//     basicText.interactive = true;
//     basicText.buttonMode = true;
//     basicText.on('pointerdown', onClick);
//     app.stage.addChild(basicText);
// });
//
// function onClick() {
//     app.stage.addChild(bunny);
//     app.ticker.add(() => {
//         bunny.rotation += 0.01;
//     });
// }

setupStats();

export { app, gameWidth, gameHeight };