import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";
import Controller from "./controller.js";
//import { zombies } from "./global.js";
//import Matter from "matter-js";

const window = document.defaultView
const canvasSize = 512;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  transparent: true,
});

const loader = new PIXI.Loader();
loader.add("background", "assets/background.png").load((loader, resources) => {

  const background = new PIXI.Sprite(resources.background.texture);
  
  background.position.set(0, 0);
  background.scale.set(canvasSize / background.width, canvasSize / background.height);

  app.stage.addChild(background);
});


initGame();

async function initGame() {
  try { 
    console.log("loading...")
    await loadAssets();
    console.log("loaded")
    let player = new Player({app});
    let controller = new Controller({app, player})
    let zSpawner = new Spawner({ app, create: ()=> new Zombie({app,player})});

    let gameStartScene = createScene("Click to Start");
    let gameOverScene = createScene("Game Over");

    app.gameStarted = false;

    app.ticker.add((delta) => {
      gameOverScene.visible = player.dead;
      gameStartScene.visible = !app.gameStarted;
      if (app.gameStarted === false) return;
      player.update(delta);
      controller.update(delta);
      zSpawner.spawns.forEach((zombie) => zombie.update(delta));

      bulletHitTest({
        bullets:player.shooting.bullets, 
        zombies:zSpawner.spawns, 
        bulletRadius:8,
        zombieRadius:16});

        console.log(player.position.x + " " + player.position.y)
    });

  } catch (error) {
    console.log(error.message);
    console.log("Load Failed");
  }
}

function bulletHitTest({bullets,zombies,bulletRadius, zombieRadius}){
  bullets.forEach(bullet => {
    zombies.forEach((zombie,index)=>{
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < bulletRadius + zombieRadius - 1){
        zombies.splice(index,1)
        zombie.kill();
      }
    })
  })
}

function createScene(sceneText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText);
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

function startGame(){
  app.gameStarted = true;
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    //zombies.forEach(z => PIXI.Loader.shared.add(`assets/${z}.json`))
    PIXI.Loader.shared.add("assets/Frames/atlas.json");
    PIXI.Loader.shared.add("assets/copzee.json") //trying zombie cop
    PIXI.Loader.shared.add("bullet" , "assets/bullet.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  })
}

document.addEventListener("click", startGame);