import tmi from 'tmi.js';
import { app, gameWidth, gameHeight, state } from './game';
import * as PIXI from 'pixi.js';
import { player } from "./setupPlayer";
import { gsap } from "gsap";

let sheep_map = {};
let sheep_area = new PIXI.Container();

export default function setupChat() {
    app.stage.addChild(sheep_area);

    const client = new tmi.Client({
        channels: ['moonmoon']
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
        // console.log(`${tags['display-name']}: ${message}`);
        // console.log(tags);
        // console.log(tags.emotes);
        // console.log(`https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`);

        const loaderOptions = {
            loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
            xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
        };

        // Check if user name already exists, do nothing for now if it does
        if(!sheep_map.hasOwnProperty(tags['user-id'])) {
            if(tags.emotes) {
                let emote_id = tags.emotes ? Object.keys(tags.emotes)[0] : 305197735;
                let emote_resource = `emote_${emote_id}`;
                // Check if emote already exists in resources
                if (!app.loader.resources.hasOwnProperty(emote_resource)) {
                    // Load if it doesn't
                    app.loader.add(emote_resource, `https://static-cdn.jtvnw.net/emoticons/v1/${emote_id}/3.0`, loaderOptions).load((loader, resources) => {
                        add_emote(emote_resource, resources, tags);
                    });
                } else {
                    // Just add it if it does
                    add_emote(emote_resource, app.loader.resources, tags);
                }
            }
        } else /*if (message[0] === '!')*/ { // removed for testing
            let movex = sheep_map[tags['user-id']].x;
            let movey = sheep_map[tags['user-id']].y;
            const speed = 100;
            switch(message) {
                case '!N':
                    movey -= speed;
                    break;
                case '!E':
                    movex += speed;
                    break;
                case '!S':
                    movey += speed;
                    break;
                case '!W':
                    movex -= speed;
                    break;
                default:
                    movex += ((Math.round(Math.random()) * 2 - 1) * speed) * Math.round(Math.random());
                    movey += ((Math.round(Math.random()) * 2 - 1) * speed) * Math.round(Math.random());
            }

            if(!sheep_map[tags['user-id']].moving) {
                sheep_map[tags['user-id']].moving = true;
                gsap.to(sheep_map[tags['user-id']], {
                    x: movex, y: movey, duration: 3, onComplete: () => {
                        sheep_map[tags['user-id']].moving = false
                    }
                });
            }
        }
    });

    app.ticker.add((delta) => {
        if(state.screen === 'playing') {
            for (const sheep in sheep_map) {
                let trueSheepPos = new PIXI.Point(sheep_map[sheep].x + sheep_area.x, sheep_map[sheep].y + sheep_area.y)
                if (distanceBetweenTwoPoints(trueSheepPos, player.position) < 40) {
                    sheep_map[sheep].visible = false;
                    // sheep_map[sheep].destroy();
                    // delete sheep_map[sheep];
                }
            }
        }
    });
}

function add_emote(emote_resource, resources, tags) {
    let emote_container = new PIXI.Container();

    emote_container.x = Math.floor(Math.random() * (gameWidth - 200) + 100);
    emote_container.y = Math.floor(Math.random() * (gameHeight - 100) + 100);

    let emote_sprite = new PIXI.Sprite(resources[emote_resource].texture);

    emote_sprite.anchor.x = 0.5;
    emote_sprite.anchor.y = 0.5;

    const fit = calculateAspectRatioFit(emote_sprite.width, emote_sprite.height, 28, 28);
    emote_sprite.width = fit.width;
    emote_sprite.height = fit.height;

    let color = tags['color'] ? tags['color'] : '#ffffff';

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 10,
        fill: [color],
    });

    const name_text = new PIXI.Text(tags['display-name'], style);
    name_text.x = (name_text.width / 2) * -1;
    name_text.y = -30;

    emote_container.direction = null;

    sheep_map[tags['user-id']] = emote_container;

    emote_container.addChild(emote_sprite);
    emote_container.addChild(name_text);

    sheep_area.addChild(emote_container);

    //app.stage.addChild(emote_container);
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

export { sheep_area };