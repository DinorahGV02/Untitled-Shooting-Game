import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Controller{
    constructor({app, player}){
        this.app = app
        this.player = player
    }
    
    update(delta){
        const up = new Victor(0,-1);
        const down = new Victor(0,1);
        const left = new Victor(-1,0);
        const right =new Victor(1,0);
        let speed = 0.1;
        
        window.addEventListener("keydown", (e)=>{
            if(e.code === 'KeyW'){
                this.player.position.set(this.player.position.x, this.player.position.y + up.y * speed * delta);
            }
            if(e.code === 'KeyS'){
                this.player.position.set(this.player.position.x, this.player.position.y + down.y * speed * delta);
            }
            if(e.code === 'KeyA'){
                this.player.position.set(this.player.position.x+ left.x * speed * delta, this.player.position.y);
            }
            if(e.code === 'KeyD'){
                this.player.position.set(this.player.position.x+ right.x * speed * delta, this.player.position.y);
            }
        })

        window.addEventListener("keyup", (e) => {
            delta = 0;
        })
    }
}