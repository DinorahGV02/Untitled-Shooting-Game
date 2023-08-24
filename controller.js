import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Controller {
    constructor({ app, player }) {
        this.app = app;
        this.player = player;
        this.isPaused = false;

        
        this.keysPressed = {};

        this.setupInputListeners(); 
    }

    setupInputListeners() {
        window.addEventListener("keydown", (e) => {
            if (e.code === 'KeyW' || e.code === 'KeyS' || e.code === 'KeyA' || e.code === 'KeyD') {
                this.isPaused = false; 
                this.keysPressed[e.code] = true; 
            }
        });

        window.addEventListener("keyup", (e) => {
            this.isPaused = true;
            this.keysPressed[e.code] = false; 
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

        
        let newPosition = new Victor(this.player.position.x, this.player.position.y);

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

        
        this.player.position.set(newPosition.x, newPosition.y);
    }
}