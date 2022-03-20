import { Scene } from "./components/scene.js";


class Esla {
    constructor() {
        this.name = "esla"
        this.z_index = 0
        this.activated = false

        this.set = (width, height, socket) => {
            this.scene = new Scene();
        
            socket.on(this.name, (data) => {
                this.scene.update_data(data["body_pose"])
            });
        
        this.activated = true;
    
        }
    }

    resume = () => {
        this.scene.reset();
    };
    
    windowResized = () => {}
    
    
    pause = () => {};
    
    update = () => {
        this.scene.update()
    
    }
    
    show = () => {
        // this.scene.render();
    }
    
}

export const esla = new Esla();
