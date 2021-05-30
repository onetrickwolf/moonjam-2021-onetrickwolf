import tmi from 'tmi.js';
import { app, gameWidth, gameHeight, state } from './game';
import * as PIXI from 'pixi.js';
import { player } from "./setupPlayer";

let sheep = [];

export default function setupChat() {
    const client = new tmi.Client({
        channels: ['moonmoon']
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
        // console.log(`${tags['display-name']}: ${message}`);
        // console.log(tags);
        // console.log(tags.emotes);
        // console.log(`https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`);

        let emote_id = tags.emotes ? Object.keys(tags.emotes)[0] : 25;

        let emote_resource = `emote_${emote_id}`;

        const loaderOptions = {
            loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
            xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
        };

        // Check if emote already exists in resources
        if (!app.loader.resources.hasOwnProperty(emote_resource)) {
            // Load if it doesn't
            app.loader.add(emote_resource, `https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`, loaderOptions).load((loader, resources) => {
                add_emote(emote_resource, resources);
            });
        } else {
            // Just add it if it does
            add_emote(emote_resource, app.loader.resources);
        }
    });

    app.ticker.add((delta) => {
        if(state.screen === 'playing') {
            sheep.forEach((sprite, index) => {
                if (distanceBetweenTwoPoints(sprite.position, player.position) < 40) {
                    sprite.destroy();
                    sheep.splice(index, 1);
                }
            })
        }
    });
}

function add_emote(emote_resource, resources) {
    let emote_sprite = new PIXI.Sprite(resources[emote_resource].texture);

    emote_sprite.x = Math.floor(Math.random() * (gameWidth - 200) + 100);
    emote_sprite.y = Math.floor(Math.random() * (gameHeight - 100) + 100);

    emote_sprite.anchor.x = 0.5;
    emote_sprite.anchor.y = 0.5;

    const fit = calculateAspectRatioFit(emote_sprite.width, emote_sprite.height, 28, 28);
    emote_sprite.width = fit.width;
    emote_sprite.height = fit.height;

    sheep.push(emote_sprite);

    app.stage.addChild(emote_sprite);
}

function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.sqrt( a*a + b*b );
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
}