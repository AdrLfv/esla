import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';


export class Scene {
    constructor() {
        // Video
        const canvasElement = document.createElement('canvas');

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

        this.body_pose = [];
        this.init = false;

        // Scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x000000);
        // Init the renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasElement,
            alpha: true,
            antialias: true,
        })
        // renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvasElement);
        // document.body.appendChild(renderer.domElement);

        // Model
        const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';

        let stacy_txt = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
        stacy_txt.flipY = false;

        const stacy_mtl = new THREE.MeshPhongMaterial({
            map: stacy_txt,
            color: 0xffffff,
            skinning: true
        });

        var loader = new GLTFLoader();

        loader.load(
            MODEL_PATH,
            gltf => {
                model = gltf.scene;
                let fileAnimations = gltf.animations;

                model.traverse(o => {

                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                        o.material = stacy_mtl;

                    }
                    if (o.isBone && o.name === 'mixamorigNeck') {
                        this.neck = o;

                    }
                    if (o.isBone && o.name === 'mixamorigSpine') {
                        this.waist = o;
                    }

                });

                model.scale.set(7, 10, 7);

                model.position.x = 0;
                model.position.y = -11;
                model.position.z = 0;

                this.scene.add(model);

                // loaderAnim.remove();

                this.mixer = new THREE.AnimationMixer(model);

                let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

                idleAnim.tracks.splice(3, 3);
                idleAnim.tracks.splice(9, 3);

                let idle = this.mixer.clipAction(idleAnim);
                idle.play();
            },
            undefined, // We don't need this function
            function (error) {
                console.error(error);
            }
        );
        // Camera

        let fov = 75
        let near = 0.01
        let far = 1000
        this.camera = new THREE.PerspectiveCamera(fov, 640 / 480, near, far)

        this.camera.position.x = 0;
        this.camera.position.y = 5;
        this.camera.position.z = 10;

        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.clock = new THREE.Clock()

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        this.scene.add(hemiLight);

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
        this.scene.add(dirLight);
        console.log(this.mixer);
    }

    onResults() {

        if (this.body_pose.length == 0) return;
        let pose_nose = new THREE.Vector3(this.body_pose[0].slice(0, 3)[0],this.body_pose[0].slice(0, 3)[1],this.body_pose[0].slice(0, 3)[2]);
        let pose_right_ear = new THREE.Vector3(this.body_pose[7].slice(0, 3)[0],this.body_pose[7].slice(0, 3)[1],this.body_pose[7].slice(0, 3)[2]);
        return pose_nose.angleTo(pose_right_ear);
    }

    moveJoint(coor, joint, degreeLimit) {
        let degrees = getcoorDegrees(coor.x, coor.y, degreeLimit);
        joint.rotation.y = THREE.Math.degToRad(degrees.x);
        joint.rotation.x = THREE.Math.degToRad(degrees.y);
        console.log(joint.rotation.x);
    }

    reset() { }

    render() {
        this.renderer.render(this.scene, this.camera);
    }


    update_data(body_pose) {

        if (this.mixer) {
            // if (this.mixer != undefined) {
            this.mixer.update(this.clock.getDelta());
        }

        this.body_pose = body_pose;
        if(this.neck.rotation)
        {
            // console.log(this.neck.rotation.x, " ", this.neck.rotation.y);
            var neck_angle = this.onResults()
            console.log(neck_angle);
            this.neck.rotation.y = -(neck_angle-0.05)*15;
        }
        // this.neck.rotation.x = 1;
    }

    show() { }

    update() { }


}

