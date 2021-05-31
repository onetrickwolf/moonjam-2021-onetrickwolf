import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'
import setupStats from './setupStats';
import setupPlayer, {player} from "./setupPlayer";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import setupChat, { sheep_map, sheep_area } from "./setupChat";

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
    screen: 'intro' // Change to 'intro' for launch, 'playing' for test
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

const joined = new PIXI.Text('PLAYERS: 0');
joined.x = 10;
joined.y = 40;
app.stage.addChild(joined);

function onClick() {
    setupField();
    startText.visible = false;
    state.screen = 'playing';
}

function setupField() {
    sheep_area.x = sheep_area.x + 800;

    let currX = 0;
    let currY = 50;

    const spacing = 110;

    for (const sheep in sheep_map) {
        sheep_map[sheep].x = currX + getRandomInt(-20, 20);
        sheep_map[sheep].y = currY + getRandomInt(-20, 20);

        goal.x = currX + 400 + getRandomInt(-20, 20);
        goal.y = getRandomInt(gameHeight / 4, gameHeight - (gameHeight / 4));

        currY += spacing;
        if(currY > gameHeight) {
            currY = 50;
            currX +=spacing;
        }
    }
}

let goal;

export function setupGoal() {
    const goal_img = 'https://static-cdn.jtvnw.net/emoticons/v2/300579728/default/dark/3.0';

    const loaderOptions = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
    };

    app.loader.add('goal', goal_img, loaderOptions).load((loader, resources) => {
        goal = new PIXI.Sprite(resources.goal.texture);

        goal.x = gameWidth / 2 + (gameWidth / 4);
        goal.y = gameHeight / 2;

        goal.width = goal.width;
        goal.height = goal.height;

        goal.anchor.x = 0.5;
        goal.anchor.y = 0.5;

        sheep_area.addChild(goal);
    });

    app.ticker.add((delta) => {
        if(state.screen === 'playing') {
            let trueGoalPos = new PIXI.Point(goal.x + sheep_area.x, goal.y + sheep_area.y)
            if (distanceBetweenTwoPoints(trueGoalPos, player.position) < 80) {
                goal.visible = false;
            }
        }
    });
}

function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.sqrt( a*a + b*b );
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export { app, gameWidth, gameHeight, state, joined };