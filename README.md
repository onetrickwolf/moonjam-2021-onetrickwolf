# Dodge The Chat by onetrickwolf

Built with node 14.17.0 and v1.22.5 (other versions and npm will probably work)
Needs git as dependecy to build electron apps I believe

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

I am also including some videos.

Please ping me if you need any help or questions happy to help :)