
// import * as THREE from './three/build/three.module.js';
// import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
// import { MathUtils } from './three/src/math/MathUtils.js'
// import { VertexNormalsHelper } from './three/examples/jsm/helpers/VertexNormalsHelper.js';
// import { FontLoader } from './three/examples/jsm/loaders/FontLoader.js';

// import * as THREE from "https://github.com/mrdoob/three.js/blob/master/build/three.module.js";
// import * as THREE from 'https://unpkg.com/three@0.138.0/build/three.module.js';
import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.138.0/examples/jsm/loaders/GLTFLoader.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@0.138.0/examples/jsm/helpers/VertexNormalsHelper.js';
// import { FontLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/FontLoader.js';


export class Scene {
    constructor() {
        this.count = 0;
        // Video
        const canvasElement = document.createElement('canvas');
        this.clock = new THREE.Clock()
        this.currentlyAnimating = false;
        let loaderAnim = document.getElementById('js-loader');
        this.model;

        this.basic_angle_head_x;
        this.basic_angle_head_y;
        this.basic_angle_head_z;
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
        // this.scene.background = new THREE.Color(0x000000);
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

        var model_loader = new GLTFLoader();

        model_loader.load(
            MODEL_PATH,
            gltf => {
                this.model = gltf.scene;
                let fileAnimations = gltf.animations;

                this.model.traverse(o => {

                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                        o.material = stacy_mtl;
                    }
                    if (o.isBone && o.name === 'mixamorigNeck') {
                        this.neck = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigHead') {
                        this.head = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine') {
                        this.spine = o;
                        // const vec = new THREE.Vector3();
                        // this.spine.getWorldPosition(vec)
                        // console.log("this.spine.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigRightShoulder') {
                        this.right_shoulder = o;
                        // console.log(this.right_shoulder);
        

                        // const vec = new THREE.Vector3();
                        // this.right_shoulder.getWorldPosition(vec)
                        // console.log("this.right_shoulder.position : ", vec);

                        // console.log("this.right_shoulder. local position : ", this.right_shoulder.position);


                    }
                    else if (o.isBone && o.name === 'mixamorigLeftShoulder') {
                        this.left_shoulder = o;
                        // console.log(this.left_shoulder);
                    }
                    else if (o.isBone && o.name === 'mixamorigRightArm') {
                        this.right_arm = o;
                        // const vec = new THREE.Vector3();
                        // this.right_arm.getWorldPosition(vec)
                        // console.log("this.right_arm.position : ", vec);

                    }
                    else if (o.isBone && o.name === 'mixamorigRightForeArm') {
                        this.right_fore_arm = o;

                        // const vec = new THREE.Vector3();
                        // this.right_fore_arm.getWorldPosition(vec)
                        // console.log("this.right_fore_arm.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftArm') {
                        this.left_arm = o;

                        // const vec = new THREE.Vector3();
                        // this.left_arm.getWorldPosition(vec)
                        // console.log("this.left_arm.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftForeArm') {
                        this.left_fore_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightLeg') {
                        this.right_leg = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine1') {
                        this.spine_1 = o;
                        // const vec = new THREE.Vector3();
                        // this.spine_1.getWorldPosition(vec)
                        // console.log("this.spine_1.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine2') {
                        this.spine_2 = o;

                        var helper_axes = new THREE.AxesHelper(80);
                        this.spine_2.add(helper_axes);

                        // console.log("this.spine_2. local position : ", this.spine_2.position);

                        // const vec = new THREE.Vector3();
                        // this.spine_2.getWorldPosition(vec)
                        // console.log("this.spine_2.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigHips') {
                        this.hips = o;
                        
                        // const vec = new THREE.Vector3();
                        // this.hips.getWorldPosition(vec)
                        // console.log("this.hips.position : ", vec);
                        // const vec = new THREE.Vector3();
                        // this.hips.getWorldPosition(vec)
                        // console.log("this.hips.position : ", vec);

                        // console.log("this.hips. local position : ", this.hips.position);

                    }

                });

                // this.model.scale.set(7, 10, 7);
                this.model.scale.set(4, 7, 4);
                this.model.position.x = 0;
                this.model.position.y = -2; // -11
                this.model.position.z = 0;

                this.scene.add(this.model);

                const skeletonHelper = new THREE.SkeletonHelper(this.model);
                this.scene.add(skeletonHelper);
                // this.model.visible = false;
            },
            undefined, // We don't need this function
            function (error) {
                console.error(error);
            }
        );
        // const axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( axesHelper );

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
    }

    reset() { }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    show() { }

    update() { }

    update_data(body_pose) {

        this.body_pose = body_pose;

        if (this.neck) {
            // this.apply_rotation(this.neck);
        }

        if (this.right_shoulder) {
            // this.apply_rotation(this.right_shoulder); 
        }
        if (this.right_arm) {
            this.poseAngles(this.right_arm);
            // this.right_arm.rotation.setFromVector3(this.right_arm.worldToLocal(new THREE.Vector3(0,Math.PI/2,0)));
        }
        if (this.right_fore_arm) {
            // this.apply_rotation(this.right_fore_arm);
        }
        if (this.left_arm) {
            // this.apply_rotation(this.left_arm);
        }
        if (this.left_fore_arm) {
            // this.apply_rotation(this.left_fore_arm);
        }
        if (this.hips) {
            // this.apply_rotation(this.left_fore_arm);
        }
    }

    poseAngles(joint) {
        if (this.body_pose.length == 0) return;
        const pose_nose = new THREE.Vector3(this.body_pose[0].slice(0, 3)[0], -this.body_pose[0].slice(0, 3)[1], -this.body_pose[0].slice(0, 3)[2]);
        const pose_mouth_left = new THREE.Vector3(this.body_pose[9].slice(0, 3)[0], -this.body_pose[9].slice(0, 3)[1], -this.body_pose[9].slice(0, 3)[2]);
        const pose_mouth_right = new THREE.Vector3(this.body_pose[10].slice(0, 3)[0], -this.body_pose[10].slice(0, 3)[1], -this.body_pose[10].slice(0, 3)[2]);
        const pose_left_shoulder = new THREE.Vector3(this.body_pose[11].slice(0, 3)[0], -this.body_pose[11].slice(0, 3)[1], -this.body_pose[11].slice(0, 3)[2]);
        const pose_right_shoulder = new THREE.Vector3(this.body_pose[12].slice(0, 3)[0], -this.body_pose[12].slice(0, 3)[1], -this.body_pose[12].slice(0, 3)[2]);
        const pose_right_elbow = new THREE.Vector3(this.body_pose[14].slice(0, 3)[0], -this.body_pose[14].slice(0, 3)[1], -this.body_pose[14].slice(0, 3)[2]);
        const pose_left_wrist = new THREE.Vector3(this.body_pose[15].slice(0, 3)[0], -this.body_pose[15].slice(0, 3)[1], -this.body_pose[15].slice(0, 3)[2]);
        const pose_right_wrist = new THREE.Vector3(this.body_pose[16].slice(0, 3)[0], -this.body_pose[16].slice(0, 3)[1], -this.body_pose[16].slice(0, 3)[2]);
        const pose_left_hip = new THREE.Vector3(this.body_pose[23].slice(0, 3)[0], -this.body_pose[23].slice(0, 3)[1], -this.body_pose[23].slice(0, 3)[2]);
        const pose_right_hip = new THREE.Vector3(this.body_pose[24].slice(0, 3)[0], -this.body_pose[24].slice(0, 3)[1], -this.body_pose[24].slice(0, 3)[2]);
        const pose_neck = ((new THREE.Vector3).copy(pose_right_hip)).add(pose_left_hip).multiplyScalar(0.5);
        
        const pose_spine_2 = ((new THREE.Vector3).copy(pose_right_shoulder)).add(pose_left_shoulder).multiplyScalar(0.5); //.multiplyScalar(0.728);
        // const pose_mixamo_right_shoulder = new THREE.Vector3(
        //     pose_right_shoulder.x + 0.33*(new THREE.Vector3).subVectors(pose_left_shoulder, pose_right_shoulder),
        //     pose_hips.y + 1.158*(new THREE.Vector3).subVectors(pose_spine_2, pose_hips),
        //     pose_spine_2.z
        // );
        // const pose_mixamo_left_shoulder = new THREE.Vector3(
        //     pose_left_shoulder.x - 0.33*(new THREE.Vector3).subVectors(pose_left_shoulder, pose_right_shoulder),
        //     pose_hips.y + 1.158*(new THREE.Vector3).subVectors(pose_spine_2, pose_hips),
        //     pose_spine_2.z
        // );

        if (joint == this.neck) {
            //ATTENTION : point1 à point_articulation doivent former l'axe y du bone à pivoter
            const vec_no_s2 = joint.worldToLocal((new THREE.Vector3).subVectors(pose_nose, pose_spine_2));
            const vec_rs_s2 = joint.worldToLocal((new THREE.Vector3).subVectors(pose_right_shoulder, pose_spine_2));
            const vec_mr_ml = joint.worldToLocal((new THREE.Vector3).subVectors(pose_mouth_right, pose_mouth_left));
            const result = this.anglesBetweenVectors3D(vec_mr_ml, vec_rs_s2);

            // result.z = this.anglesBetweenWorld(vec_mr_ml,vec_rs_s2 ).z;
            // result.y = this.anglesBetweenVectors3D(vec_mr_ml,vec_rs_s2 ).y;

            return result;
        }
        else if (joint == this.right_arm) {
            var point_parent = pose_spine_2;
            var point_articulation = pose_right_shoulder;
            var point_child = pose_right_elbow;

            const vec_child_world = new THREE.Vector3(5,0,0);
            setJointAnglesFromVects1(joint, vec_child_world);
        }
        else if (joint == this.right_fore_arm) {
            var point1 = pose_right_shoulder;
            var point_articulation = pose_right_wrist;
            var point2 = pose_right_elbow;
        }
    }
}

function setJointAnglesFromVects1(joint, vec_child_world)
{
    const quat_pose_rot = new THREE.Quaternion();
    const vec_local = joint.position;
    const vec_child_local = joint.worldToLocal(vec_child_world.clone())
    quat_pose_rot.setFromUnitVectors(vec_local.clone().normalize(), vec_child_local.clone().normalize());
    joint.setRotationFromQuaternion(quat_pose_rot);
}

function setJointAnglesFromVects4(joint)
{
    var quat_pose_rot = new THREE.Quaternion();
    const vec_local = joint.position;
    const vec_child_local = new THREE.Vector3(0,0,5);
    quat_pose_rot.setFromUnitVectors(vec_local.clone().normalize(), vec_child_local.clone().normalize());
    joint.setRotationFromQuaternion(quat_pose_rot);
}