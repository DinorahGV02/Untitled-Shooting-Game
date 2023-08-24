import * as PIXI from "pixi.js";
import Player from "./player.js";
import Zombie from "./zombie.js";
import Spawner from "./spawner.js";
import Controller from "./controller.js";
//import Matter from "matter-js";

const window = document.defaultView
const canvasSize = 512;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

initGame();
async function initGame(){
  try{
    console.log("loading...");
    await loadAssets();
    console.log("Loaded");
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

  } catch (error){
    console.log(error.message);
    console.log("Load failed");
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

async function loadAssets(){
  return new Promise ((resolve, reject)=> {
    PIXI.Loader.shared.add("assets/Frames/idle/atlas.json");
    PIXI.Loader.shared.add("assets/Frames/run/atlas.json");
    PIXI.Loader.shared.add("assets/Frames/shoot/atlas.json");
    PIXI.Loader.shared.add("assets/Frames/death/atlas.json");
    PIXI.Loader.shared.add("assets/Frames/aim/atlas.json");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  })
}
document.addEventListener("click", startGame);