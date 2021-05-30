import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'
import setupStats from './setupStats';
import setupPlayer from "./setupPlayer";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

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
    screen: 'playing' // Change to 'intro' for launch
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