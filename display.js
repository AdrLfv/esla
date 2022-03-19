import { Scene } from "./components/scene.js";
//import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
//import * as dat from './node_modules/dat.gui'
// import { Three_hand } from "./components/three_hand.js";
// import { Three_body } from "./components/three_body.js";



class Esla {
    constructor() {
        this.name = "esla"
        this.z_index = 0
        this.activated = false

        this.set = (width, height, socket) => {
            this.scene = new Scene();
            // this.three_body = new Three_body(");
            // this.three_right_hand = new Three_hand();
            // this.three_left_hand = new Three_hand();
        
            socket.on(this.name, (data) => {
                this.scene.update_data(data["body_pose"])
                // this.three_face.update_data(data)
                // this.three_hand.update_data(data)
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
        // this.three_face.update(this)
        // this.three_hand.update(this)
        this.scene.update()
    
    }
    
    show = () => {
        this.scene.render();
    }
    
}

export const esla = new Esla();
