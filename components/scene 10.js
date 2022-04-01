
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
                        console.log("this.right_fore_arm : ", this.right_fore_arm);

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
                        // console.log("this.spine_2 : ", this.spine_2);
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine') {
                        this.spine = o;

                        // var helper_axes = new THREE.AxesHelper(80);
                        // this.spine.add(helper_axes);

                        // console.log("this.spine_2. local position : ", this.spine_2.position);

                        // const vec = new THREE.Vector3();
                        // this.spine.getWorldPosition(vec)
                        // console.log("this.spine.position : ", vec);
                        // console.log("this.spine : ", this.spine);
                    }
                    else if (o.isBone && o.name === 'mixamorigHips') {
                        this.hips = o;
                        
                        // const vec = new THREE.Vector3();
                        // this.hips.getWorldPosition(vec)
                        // console.log("this.hips.position : ", vec);
                    }
                    else if (o.isBone && o.name === 'mixamorigHeadTop_end') {
                        this.head_top_end = o;
                        // this.head_top_end.rotateY(Math.PI);
                        // const vec = new THREE.Vector3();
                        // this.head_top_end.getWorldPosition(vec)
                        // console.log("this.head_top_end.position : ", vec);
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
        
        const pose_hips = ((new THREE.Vector3).copy(pose_left_hip)).add(pose_right_hip).multiplyScalar(0.5); //.multiplyScalar(0.728);
        const pose_spine_2 = ((new THREE.Vector3).copy(pose_right_shoulder)).add(pose_left_shoulder).multiplyScalar(0.5); //.multiplyScalar(0.728);
        
        if (joint == this.neck) {
            var point_parent = pose_hips;
            var point_articulation = pose_spine_2;
            var point_arm = pose_right_elbow;
            // console.log("point_articulation", point_articulation);
            // console.log("point_arm", point_arm);
            // console.log("pose_hips", pose_hips);
            // console.log("pose_right_elbow", pose_right_elbow);

            const vec_parent = (new THREE.Vector3).subVectors(point_articulation, point_parent).multiplyScalar(0.375);
            // console.log("vec_parent ", vec_parent);
            const vec_bone = (new THREE.Vector3).subVectors(point_arm, point_articulation);
            // console.log("vec_bone ", vec_bone);

            setJointAnglesFromVects1(joint, vec_bone, vec_parent);
            // setJointAnglesFromVects5(joint, vec_bone);
        }
        else if (joint == this.right_arm) {
            var point_parent = pose_spine_2;
            var point_articulation = pose_right_shoulder;
            var point_child = pose_right_elbow;
            // var point_parent = pose_hips;
            // var point_articulation = pose_spine_2;
            // var point_arm = pose_right_elbow;
            // console.log("point_articulation", point_articulation);
            // console.log("point_arm", point_arm);
            // console.log("pose_hips", pose_hips);
            // console.log("pose_right_elbow", pose_right_elbow);

            const vec_parent = (new THREE.Vector3).subVectors(point_articulation, point_parent);
            console.log("vec_parent ", vec_parent);
            const vec_bone = (new THREE.Vector3).subVectors(point_child, point_articulation);
            console.log("vec_bone ", vec_bone);

            setJointAnglesFromVects1(joint, vec_parent, vec_bone);
            // setJointAnglesFromVects5(joint, vec_bone);
        }
        // else if (joint == this.right_fore_arm) {
        //     var point_parent = pose_hips;
        //     var point_articulation = pose_spine_2;
        //     var point_child = pose_right_elbow;
        //     // console.log("point_articulation", point_articulation);
        //     // console.log("point_arm", point_arm);
        //     // console.log("pose_hips", pose_hips);
        //     // console.log("pose_right_elbow", pose_right_elbow);

        //     const vec_parent = (new THREE.Vector3).subVectors(point_parent, point_articulation);
        //     console.log("vec_parent ", vec_parent);
        //     const vec_bone = (new THREE.Vector3).subVectors(point_child, point_articulation);
        //     console.log("vec_bone ", vec_bone);

        //     // setJointAnglesFromVects1(joint, vec_bone, vec_parent);
        //     // setJointAnglesFromVects5(joint, vec_bone);
        // }
    }
}

function setJointAnglesFromVects1(joint, vec_parent_world, vec_child_world)
{

    const vec_child_local = joint.parent.clone().worldToLocal(vec_child_world.clone());
    const vec_parent_local = joint.parent.clone().worldToLocal(vec_parent_world.clone());
    var quat_pose_rot = new THREE.Quaternion();

    quat_pose_rot.setFromUnitVectors(vec_parent_local.clone().normalize(), vec_child_local.clone().normalize());
    joint.quaternion.rotateTowards(quat_pose_rot.clone(), 0.1);
}

function setJointAnglesFromVects5(joint, vec_child_world)
{
    const vec_child_local = joint.parent.clone().worldToLocal(vec_child_world.clone());
    var quat_pose_rot = new THREE.Quaternion();
    
    var normalMatrix = new THREE.Matrix3().getNormalMatrix(joint.parent.clone().matrix);
    var normal = new THREE.Vector3(0, 1, 0);
    var vec_parent_local = normal.clone().applyMatrix3(normalMatrix.clone()).normalize()
    // console.log("vec_world", joint.parent.localToWorld(vec_local));

    quat_pose_rot.setFromUnitVectors(vec_parent_local.clone().normalize(), vec_child_local.clone().normalize());
    joint.quaternion.rotateTowards(quat_pose_rot.clone(), 0.1);
}