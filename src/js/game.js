import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'
import setupStats from './setupStats';
import setupPlayer from "./setupPlayer";

// Game

const gameWidth = 1280;
const gameHeight = 720;

const app = new PIXI.Application({
    backgroundColor: 0xe2e2e2,
    width: gameWidth,
    height: gameHeight,
    resolution: window.devicePixelRatio,
});

let state = {
    screen: 'intro'
}

document.body.appendChild(app.view);

setupPlayer();
setupStats();

const startText = new PIXI.Text('START');
startText.x = 10;
startText.y = 10;
startText.interactive = true;
startText.buttonMode = true;
startText.on('pointerup', onClick);
app.stage.addChild(startText);

function onClick() {
    startText.visible = false;
    state.screen = 'playing';
}

export { app, gameWidth, gameHeight, state };