import * as PIXI from 'pixi.js';
import bunny_png from '../images/bunny.png'

// Twitch Integration

import tmi from 'tmi.js';

const client = new tmi.Client({
    channels: ['onetrickwolf']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`);
    console.log(tags);
    console.log(tags.emotes);
    let emote_id = tags.emotes ? Object.keys(tags.emotes)[0] : 25;
    console.log(`https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`);

    let emote_resource = `emote_${emote_id}`;

    const loaderOptions = {
        loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
        xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
    };

    app.loader.add(emote_resource, `https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`, loaderOptions).load((loader, resources) => {
        console.log(resources);
        let emote_sprite = new PIXI.Sprite(resources[emote_resource].texture);

        app.stage.addChild(emote_sprite);
    });

    app.loader.onError.add(() => { console.log('error')});
});

// Game

const gameWidth = 1280;
const gameHeight = 720;

const app = new PIXI.Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

document.body.appendChild(app.view);

let bunny;

app.loader.add('bunny', bunny_png).load((loader, resources) => {
    bunny = new PIXI.Sprite(resources.bunny.texture);
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;
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
