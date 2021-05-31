import tmi from 'tmi.js';
import { app, gameWidth, gameHeight, state, joined, startText, joinable, gameoverText } from './game';
import * as PIXI from 'pixi.js';
import { player } from "./setupPlayer";
import { gsap } from "gsap";

let sheep_map = {};
let sheep_area = new PIXI.Container();

const debug = false;

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
            if((tags.emotes || debug) && state.screen === 'intro' && (message.toLowerCase().includes('!join') || debug)) { // true added for testing
                let emote_id = tags.emotes ? Object.keys(tags.emotes)[0] : 440;
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
        } else if (message[0] === '!' || debug) { // removed for testing
            let movex = sheep_map[tags['user-id']].x;
            let movey = sheep_map[tags['user-id']].y;
            const speed = state.chat_speed;

            if(message[1]) {
                switch (message[1].toLowerCase()) {
                    case 'n':
                        movey -= speed;
                        break;
                    case 'e':
                        movex += speed;
                        break;
                    case 's':
                        movey += speed;
                        break;
                    case 'w':
                        movex -= speed;
                        break;
                    default:
                        if(debug) {
                            movex += ((Math.round(Math.random()) * 2 - 1) * speed) * Math.round(Math.random());
                            movey += ((Math.round(Math.random()) * 2 - 1) * speed) * Math.round(Math.random());
                        }
                }
            }

            if(message[2]) {
                switch (message[2].toLowerCase()) {
                    case 'e':
                        movex += speed;
                        break;
                    case 'w':
                        movex -= speed;
                        break;
                }
            }

            if(!sheep_map[tags['user-id']].moving) {
                sheep_map[tags['user-id']].moving = true;
                gsap.to(sheep_map[tags['user-id']], {
                    x: movex, y: movey, duration: 3, onComplete: () => {
                        sheep_map[tags['user-id']].moving = false
                        if(sheep_map[tags['user-id']].visible === false) {
                            sheep_map[tags['user-id']].destroy();
                            delete sheep_map[tags['user-id']];
                            joined.text = 'PLAYERS: ' + Object.keys(sheep_map).length;
                        }
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
                    gsap.killTweensOf(sheep_area);
                    gsap.killTweensOf(player);

                    gsap.to(sheep_area, {
                        x: 800, duration: 3
                    });
                    gsap.to(player, {
                        y: gameHeight / 2, duration: 3, onComplete: () => {
                            startText.visible = true;
                            startText.text = 'CLICK TRY AGAIN';
                        }
                    });
                    gameoverText.visible = true;
                    state.screen = 'intro';
                    joinable.text = '!join [emote] to join this round';
                    // sheep_map[sheep].visible = false;
                    // if(!sheep_map[sheep].moving) {
                    //     sheep_map[sheep].destroy();
                    //     delete sheep_map[sheep];
                    //     joined.text = 'PLAYERS: ' + Object.keys(sheep_map).length;
                    // }
                }
            }
        }
    });
}

function add_emote(emote_resource, resources, tags) {
    let emote_container = new PIXI.Container();

    if(state.level === 1) {
        emote_container.x = Math.floor(Math.random() * (gameWidth - 500) + 500);
        emote_container.y = Math.floor(Math.random() * (gameHeight - 100) + 100);
    } else {
        emote_container.x = getRandomInt(0, 400);
        emote_container.y = Math.floor(Math.random() * (gameHeight - 100) + 100);
    }

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

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(0xFFFFFF, 0.5);
    graphics.drawCircle(0, 0, 10);
    graphics.endFill();

    emote_container.direction = null;

    sheep_map[tags['user-id']] = emote_container;

    joined.text = 'PLAYERS: ' + Object.keys(sheep_map).length;

    emote_container.addChild(graphics);
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export { sheep_area, sheep_map };