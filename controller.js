import * as PIXI from "pixi.js";
import Victor from "victor";

export default class Controller {
    constructor({ app, player }) {
        this.app = app;
        this.player = player;
        this.isPaused = false;

        // Initialize keysPressed as an empty object
        this.keysPressed = {};

        this.setupInputListeners(); // Call a separate method to set up input listeners
        
    }

    setupInputListeners() {
        window.addEventListener("keydown", (e) => {
            if (e.code === 'KeyW' || e.code === 'KeyS' || e.code === 'KeyA' || e.code === 'KeyD') {
                this.isPaused = false; // Resume updates on key press
                this.keysPressed[e.code] = true; // Set the corresponding key as pressed
            }
        });

        window.addEventListener("keyup", (e) => {
            this.isPaused = true;
            this.keysPressed[e.code] = false; // Set the corresponding key as released
        });
    }

    update(delta) {
        if (this.isPaused) {
            return; // Do not update if paused
        }

        const up = new Victor(0, -1);
        const down = new Victor(0, 1);
        const left = new Victor(-1, 0);
        const right = new Victor(1, 0);
        const speed = 2;
        this.run = false;

        // Calculate new position based on keys pressed
        let newPosition = new Victor(this.player.position.x, this.player.position.y);
        //animation
        let sheet = PIXI.Loader.shared.resources["assets/Frames/atlas.json"].spritesheet;
        this.player = new PIXI.AnimatedSprite(sheet.animations["run"]);

        if (this.keysPressed['KeyW']) {
            newPosition.add(up.clone().multiplyScalar(speed * delta));
            this.run = true
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