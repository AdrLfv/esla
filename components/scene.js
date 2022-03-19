import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.138.3/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.138.3/examples/jsm/loaders/GLTFLoader.js";

export class Scene {
    constructor() {
        // Video
        const canvasElement = document.createElement('canvas');
        this.mixer;
        this.clock = new THREE.Clock()
        this.currentlyAnimating = false;
        let loaderAnim = document.getElementById('js-loader');
        let model;

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

        // Init the renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            alpha: true,
            antialias: true,
        })
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        

        // Model
        const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';

        let stacy_txt = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
        stacy_txt.flipY = false;

        const stacy_mtl = new THREE.MeshPhongMaterial({
            map: stacy_txt,
            color: 0xffffff,
            skinning: true });

        var loader = new GLTFLoader();

        loader.load(
            MODEL_PATH,
            function (gltf) {
                console.log("loading");
                model = gltf.scene;
                let fileAnimations = gltf.animations;

                model.traverse(o => {

                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                        o.material = stacy_mtl;
                    }
                });
                model.scale.set(7, 7, 7);
                
                model.position.x = 0;
                model.position.y = -11;
                model.position.z = 0;

                this.scene.add(model);

                loaderAnim.remove();

                this.mixer = new THREE.AnimationMixer(model);

                let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

                this.idle = this.mixer.clipAction(idleAnim);
                idle.play();
            },
            undefined, // We don't need this function
            function (error) {
                console.error(error);
            }
        );

        let fov = 75
        let near = 0.01
        let far = 1000
        this.camera = new THREE.PerspectiveCamera(fov, 640 / 480, near, far)

        this.camera.position.x = 0;
        this.camera.position.y = -3;
        this.camera.position.z = 30;

        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.clock = new THREE.Clock()

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        scene.add(hemiLight);

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;
        // Add directional Light to scene
        scene.add(dirLight);

        this.onResults();
    }

    onResults() {

        if (this.body_pose.length == 0) return;
        let pose_nose = this.body_pose[0].slice(0, 3);
        let pose_right_ear = this.body_pose[7].slice(0, 3);
        let pose_left_ear = this.body_pose[8].slice(0, 3);
        const z_diff_RE_LE = pose_right_ear[2] - pose_left_ear[2];
        const y_diff_RE_LE = pose_right_ear[1] - pose_left_ear[1];
        const nx = pose_nose[0], ny = pose_nose[1], nz = pose_nose[2];
    }


    reset() { }

    update_data(body_pose) {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }

        this.body_pose = body_pose;
        this.onResults();
        this.renderer.render(this.scene, this.camera);
        this.requestAnimationFrame();
        // this.requestAnimationFrame(update_data);

    }

    show() { }

    update() { }


}

