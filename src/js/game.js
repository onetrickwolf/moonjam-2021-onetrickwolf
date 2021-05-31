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
    screen: 'intro', // Change to 'intro' for launch, 'playing' for test
    player_speed: 2,
    chat_speed: 100,
    level: 1
}

document.body.appendChild(app.view);

setupPlayer();
setupStats();

const startText = new PIXI.Text('CLICK HERE TO START');
startText.x = 10;
startText.y = 120;
startText.interactive = true;
startText.buttonMode = true;
startText.on('pointerup', onClick);
app.stage.addChild(startText);

const joined = new PIXI.Text('PLAYERS: 0');
joined.x = 10;
joined.y = 10;
app.stage.addChild(joined);

const level = new PIXI.Text('LEVEL: ' + state.level, {fontSize : 20});
level.x = 10;
level.y = 40;
app.stage.addChild(level);

const joinable = new PIXI.Text('!join [emote] to join this round', {fontFamily: 'Courier', fontSize : 16});
joinable.x = 10;
joinable.y = 70;
app.stage.addChild(joinable);

const gameoverStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    dropShadow: true,
    dropShadowAlpha: 0.8,
    dropShadowAngle: 2.1,
    dropShadowBlur: 4,
    dropShadowColor: '0x111111',
    dropShadowDistance: 10,
    fill: ['#ffffff'],
    stroke: '#004620',
    fontSize: 60,
    fontWeight: 'lighter',
    lineJoin: 'round',
    strokeThickness: 12,
});

const gameoverText = new PIXI.Text('GAME OVER', gameoverStyle);
gameoverText.skew.set(0.65, -0.3);
gameoverText.anchor.set(0.5, 0.5);
gameoverText.x = gameWidth / 2;
gameoverText.y = gameHeight / 2;
gameoverText.visible = false;
app.stage.addChild(gameoverText);

function onClick() {
    setupField();
    startText.visible = false;
    joinable.text = 'joining locked until next round';
    state.screen = 'playing';
    gameoverText.visible = false;
}

function setupField() {
    sheep_area.x = 800;

    let currX = 0;
    let currY = 50;

    const spacing = 110;

    for (const sheep in sheep_map) {
        gsap.killTweensOf(sheep_map[sheep]);
        sheep_map[sheep].moving = false;
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
                gsap.killTweensOf(sheep_area);
                gsap.killTweensOf(player);

                gsap.to(sheep_area, {
                    x: 800, duration: 3
                });
                gsap.to(player, {
                    y: gameHeight / 2, duration: 3, onComplete: () => {
                        startText.visible = true;
                        startText.text = 'CLICK HERE TO START NEXT LEVEL';
                        state.player_speed *= 1.5;
                        state.chat_speed +=10;
                    }
                });
                state.screen = 'intro';
                state.level++;
                joinable.text = '!join [emote] to join this round';
                level.text = 'LEVEL: ' + state.level;
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

export { app, gameWidth, gameHeight, state, joined, startText, joinable, gameoverText };