# Dodge The Chat by onetrickwolf

### Retrospective 07/27/2021

Submission page: https://jam.moon2.tv/games/dodge-the-chat

Clip: https://clips.twitch.tv/IcyIntelligentLyrebirdNerfBlueBlaster-l2lSQMdsh2oNEUZg

My goal for this game jam was to try to make the game solo with zero prep, little reference, and in a reasonable work day without typical game jam crunch. I didn't expect the outcome to be too polished but just wanted to see if it was possible and was happy with the results!

One of my rules to keep up the pace was to move on once something was working with little or no refactor. This led to some interesting patterns with circular dependecies and some potential issues with race conditions (luckily did not have large negative impact in practice).

For the next game jam I think I would like to prepare a bit more with some libraries for processing gifs, learning PixiJS a bit more, and potentially moving away from using the chat for input and having some other sort of integration for controls. I also think Electron was difficult for OBS to capture so I may experiment with trying to improve that somehow.

## Instructions for organizers

Built with node 14.17.0 and yarn v1.22.5 (other versions and npm will probably work)
Needs git as dependency to build electron apps I believe

```bash
yarn install
yarn start # OPTIONAL if you want to test in development mode
yarn make # to build exe
```
If having trouble with `yarn make` you can try `yarn make-windows`

Depending on your system, exe with be in `out` folder

I believe the exe under the make folder is all you need (I am new to electron sorry)

The other exe generated needs the whole folder.

If you need help feel free to ping me on Discord (onetrickwolf)

## Testing

The idea behind this game is that moon has 1hp and is trying to navigate through chat to get to pregario.

Moon can move by clicking and chat can join and move a small amount with chat commands.

This is a little hard to test since you need a lot of players, but I added some debugging tools.

In `src/setupChat.js` on line 10 you can set `const debug = false;` to `true`.

What this does is makes it so every chat message auto joins and any duplicate message is a random movement.

On line 16 you can set `channels: ['moonmoon']` to your own channel or a very active channel to see how the game plays.

If you are happy with the testing just set debug to false and set the channel back to moonmoon before building for Moon.

I included two videos, one with some chat input examples and one debug play session.

Please ping me if you need any help or questions happy to help :)
