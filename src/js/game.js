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

let bunny;

app.loader.add('bunny', bunny_png).load((loader, resources) => {
    bunny = new PIXI.Sprite(resources.bunny.texture);
    bunny.x = gameWidth / 2;
    bunny.y = gameHeight / 2;
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    const basicText = new PIXI.Text('Basic text in pixi');
    basicText.x = 50;
    basicText.y = 100;
    basicText.interactive = true;
    basicText.buttonMode = true;
    basicText.on('pointerdown', onClick);
    app.stage.addChild(basicText);
});

function onClick() {
    app.stage.addChild(bunny);
    app.ticker.add(() => {
        bunny.rotation += 0.01;
    });
}

setupChat();
setupStats();

export { app, gameWidth, gameHeight };