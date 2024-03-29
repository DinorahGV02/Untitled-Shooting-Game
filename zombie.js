import * as PIXI from "pixi.js";
import Victor from "victor";
import { zombies } from "./global";

export default class Zombie {
    constructor({app, player}){
    this.app = app;
    this.player = player;

    //const Radius = 16;
    this.speed = 1;
    
    
    // this.zombie.height = this.zombie.width = 32
    // this.zombie.animationSpeed = 0.1;
    

    //this.zombie = new PIXI.Graphics();
    let r = this.randomSpawnPoint();
    let zombieName = zombies[Math.floor(Math.random()*zombies.length)];
    this.speed = zombieName === "quickzee" ? 1 : 0.25;
    let sheet = PIXI.Loader.shared.resources[`assets/${zombieName}.json`].spritesheet; //trying cop
    this.zombie = new PIXI.AnimatedSprite(sheet.animations["run"]);
    this.die = new PIXI.AnimatedSprite(sheet.animations["die"]);
    this.attack = new PIXI.AnimatedSprite(sheet.animations["attack"]);
    this.zombie.animationSpeed = zombieName ==="quickzee" ? 0.2 : 0.1;

    this.zombie.play();
    this.zombie.anchor.set(0.5);
    this.zombie.position.set(r.x,r.y);
    
    //this.zombie.beginFill(0xFF0000, 1);
    //this.zombie.drawCircle(0,0, Radius);
    //this.zombie.endFill();
    app.stage.addChild(this.zombie);
    //this.attacking = false;
    }

    attackPlayer(){
      if(this.attacking) return;
      this.attacking = true;
      this.interval = setInterval(() => this.player.attack(),500);
      this.zombie.textures = this.attack.textures;
      this.zombie.animationSpeed = 0.1;
      this.zombie.play();

    }

    attackStop(){
      this.attacking = false;
      clearInterval(this.interval);
    }

    update(delta){ 
    let e = new Victor(this.zombie.position.x, this.zombie.position.y);
    let s = new Victor(this.player.position.x, this.player.position.y);

    if (e.distance(s) < this.player.width / 2){
      this.attackPlayer();
      return;
    }else{
      this.attackStop();
    }
    let d = s.subtract(e);
    let v = d.normalize().multiplyScalar(this.speed * delta );
    this.zombie.scale.x = v.x < 0 ? 1 : -1;
    this.zombie.position.set(this.zombie.position.x + v.x,this.zombie.position.y + v.y)
    }

    kill(){
      //this.app.stage.removeChild(this.zombie);
      clearInterval(this.interval);
      //die sprite
      this.zombie.textures = this.die.textures;
      this.zombie.loop = false;
      this.zombie.OnComplete = ()=>setTimeout(()=>this.app.stage.removeChild(this.zombie),30000);
      this.zombie.play();

      clearInterval(this.interval);
      ////
    }
    get position(){
      return this.zombie.position;
    }
    randomSpawnPoint() {
        let edge = Math.floor(Math.random() * 4); //random int between 0-3
        let spawnPoint = new Victor(0,0);
        let canvasSize = this.app.screen.width;
        switch (edge) {
          case 0: //top
          spawnPoint.x = canvasSize * Math.random();
          break;
          case 1: //right
          spawnPoint.x = canvasSize;
          spawnPoint.y = canvasSize * Math.random();
          break;
          case 2: //bottom
          spawnPoint.x = canvasSize * Math.random();
          spawnPoint.y = canvasSize;
          break;
          default: //left
          spawnPoint.x = 0;
          spawnPoint.y = canvasSize * Math.random();
          break;
        }
        return spawnPoint
      }
}