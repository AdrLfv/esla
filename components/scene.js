// import * as THREE from 'three';
import * as THREE from 'https://cdn.skypack.dev/three@v0.137';
//import { Three_face } from "./components/three_face.js";
export class Scene{
    constructor()
    {
        // Video
        const canvasElement = document.createElement('canvas');
        // Sizes
        let sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        canvasElement.width = sizes.width;
        canvasElement.height = sizes.height;
        canvasElement.style.position = "absolute";
        canvasElement.style.left = "0px"
        canvasElement.style.top = "0px"
        canvasElement.style.zIndex = 5


        var body = document.getElementsByTagName("body")[0];    
        body.appendChild(canvasElement);

        this.body_pose = [];
        this.init = false;

        // Scene
        this.scene = new THREE.Scene()

        // Lights
        let color = 0xFFFFFF
        let intensity = 1
        this.light = new THREE.DirectionalLight(color, intensity)
        this.light.position.set(-1, 2, 4)
        this.scene.add(this.light)

        // Box
        let boxWidth = 1.5
        let boxHeight = 1.5
        let boxDepth = 1.5
        let geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
        let material = new THREE.MeshPhongMaterial({
            color: 0x44aa88,
            transparent: true,
            opacity: 0.8
        })
        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

        let fov = 75
        let near = 0.01
        let far = 1000
        this.camera = new THREE.PerspectiveCamera(fov, 640/480, near, far)
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            alpha: true,
            antialias: true,
        })
        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
        /**
         * Animate
         */
        
        this.clock = new THREE.Clock()
               
        this.onResults();
        
        this.render()
        
        
    }

    onResults(){
          
        if(this.body_pose.length == 0) return;
        let pose_nose = this.body_pose[0].slice(0, 3);
        let pose_right_ear = this.body_pose[7].slice(0, 3);
        let pose_left_ear = this.body_pose[8].slice(0, 3);
        const z_diff_RE_LE = pose_right_ear[2] - pose_left_ear[2];
        const y_diff_RE_LE = pose_right_ear[1] - pose_left_ear[1];
        // let pose_mouth_left = this.body_pose[9].slice(0, 3);
        // let pose_left_eye_inner = this.body_pose[1].slice(0,3);
        const nx = pose_nose[0], ny= pose_nose[1], nz=pose_nose[2];
        // const mrx = pose_right_ear[0], mry = pose_right_ear[1], mrz = pose_right_ear[2];
        // const mlx = pose_left_ear[0], mly = pose_left_ear[1], mlz = pose_left_ear[2];
        
        let head_pos = new THREE.Vector3();
        head_pos.set(
            nx/185 -5.5,
            -ny/150 + 4,
            -nz/170);
        
        this.cube.position.x = head_pos.x;
        this.cube.position.y = head_pos.y;
        this.cube.position.z = head_pos.z;

        // const vec_direct_head = new THREE.Vector3((mry-ny)*(mlz-nz)-(mrz-nz)*(mly-ny),
        // (mrz-nz)*(mlx-nx)-(mrx-nx)*(mlz-nz),
        // (mrx-nx)*(mly-ny)-(mry-ny)*(mlx-nx));   
        
        // this.cube.lookAt(vec_direct_head);
        let x_axis = new THREE.Vector3(1,0,0);
        let y_axis = new THREE.Vector3(0,1,0);
        let z_axis = new THREE.Vector3(0,0,1);
        this.cube.rotation.y = THREE.Math.degToRad(-z_diff_RE_LE*1.5+15);
        this.cube.rotation.x = THREE.Math.degToRad(-y_diff_RE_LE*1.5+15);
        // this.cube.rotation.y = THREE.Math.degToRad(-z_diff_RE_LE*1.5+15);
        // this.cube.rotation.z = THREE.Math.degToRad(y_diff_RE_LE);
        // this.cube.setRotationFromAxisAngle(y_axis,z_diff_RE_LE);
        // this.cube.setRotationFromAxisAngle(z_axis,y_diff_RE_LE/25);
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    reset() {}

    update_data(body_pose) {
        this.body_pose = body_pose;
        this.onResults();
    }

    show() {}
    
    update() {}
}

