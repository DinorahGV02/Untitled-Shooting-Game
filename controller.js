import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Controller {
    constructor({ app, player }) {
        this.app = app;
        this.player = player;
        this.isPaused = false;

        
        this.keysPressed = {};

        this.setupInputListeners();

        let sheet = PIXI.Loader.shared.resources["assets/Frames/atlas.json"].spritesheet;
        this.idle = new PIXI.AnimatedSprite(sheet.animations["idle"]);
        this.run = new PIXI.AnimatedSprite(sheet.animations["run"]);
        
    }

    setupInputListeners() {
        window.addEventListener("keydown", (e) => {
            if (e.code === 'KeyW' || e.code === 'KeyS' || e.code === 'KeyA' || e.code === 'KeyD') {
                this.isPaused = false; 
                this.keysPressed[e.code] = true;
                this.player.sprite.textures = this.run.textures;
                this.player.sprite.animationSpeed = 0.1;
                this.player.sprite.play();
            }
        });

        window.addEventListener("keyup", (e) => {
            this.isPaused = true;
            this.keysPressed[e.code] = false;
            this.player.sprite.textures = this.idle.textures;
            this.player.sprite.animationSpeed = 0.1;
            this.player.sprite.play();
        });
    }

    update(delta) {
        if (this.isPaused) {
            return; 
        }

        const up = new Victor(0, -1);
        const down = new Victor(0, 1);
        const left = new Victor(-1, 0);
        const right = new Victor(1, 0);
        const speed = 2;
        //this.run = false;

        
        let newPosition = new Victor(this.player.position.x, this.player.position.y);
        //animation
        // let sheet = PIXI.Loader.shared.resources["assets/Frames/atlas.json"].spritesheet;
        // this.player = new PIXI.AnimatedSprite(sheet.animations["run"]);

        if (this.keysPressed['KeyW']) {
            newPosition.add(up.clone().multiplyScalar(speed * delta));
            
        }
        if (this.keysPressed['KeyS']) {
            newPosition.add(down.clone().multiplyScalar(speed * delta));
        }
        if (this.keysPressed['KeyA']) {
            newPosition.add(left.clone().multiplyScalar(speed * delta));
        }
        if (this.keysPressed['KeyD']) {
            newPosition.add(right.clone().multiplyScalar(speed * delta));
        }

        // Update player position
        this.player.position.set(newPosition.x, newPosition.y);

        const canvasX = this.app.view.width;
        const canvasY = this.app.view.height;
        const padding = this.player.width / 2;

        this.player.position.x = Math.max(padding, Math.min(canvasX - padding, this.player.position.x))
        this.player.position.y = Math.max(padding, Math.min(canvasY - padding, this.player.position.y))
    }
}