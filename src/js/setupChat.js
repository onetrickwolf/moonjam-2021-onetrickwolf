import tmi from 'tmi.js';
import { app, gameWidth, gameHeight } from './game';
import * as PIXI from 'pixi.js';

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
}

function add_emote(emote_resource, resources) {
    let emote_sprite = new PIXI.Sprite(resources[emote_resource].texture);

    emote_sprite.x = Math.floor(Math.random() * gameWidth);
    emote_sprite.y = Math.floor(Math.random() * gameHeight);

    const fit = calculateAspectRatioFit(emote_sprite.width, emote_sprite.height, 28, 28);
    emote_sprite.width = fit.width;
    emote_sprite.height = fit.height;

    app.stage.addChild(emote_sprite);
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
}