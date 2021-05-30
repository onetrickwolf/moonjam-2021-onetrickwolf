import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'
import setupStats from './setupStats';
import setupPlayer from "./setupPlayer";

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

setupPlayer();
setupStats();

export { app, gameWidth, gameHeight };