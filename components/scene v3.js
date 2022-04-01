import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { MathUtils } from 'https://unpkg.com/three@0.127.0/src/math/MathUtils.js'
import { VertexNormalsHelper } from 'https://unpkg.com/three@0.127.0/examples/jsm/helpers/VertexNormalsHelper.js';

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
                        this.waist = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightArm') {
                        this.right_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightForeArm') {
                        this.right_fore_arm = o;
                        // var right_fore_arm_axes = new THREE.AxesHelper(20);
                        // this.right_arm.add(right_fore_arm_axes);

                    }
                    else if (o.isBone && o.name === 'mixamorigLeftArm') {
                        this.left_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftForeArm') {
                        this.left_fore_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine1') {
                        this.spine_1 = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine2') {
                        this.spine_2 = o;
                    }

                });

                this.model.scale.set(7, 10, 7);

                this.model.position.x = 0;
                this.model.position.y = -11;
                this.model.position.z = 0;

                this.scene.add(this.model);

                const skeletonHelper = new THREE.SkeletonHelper(this.model);
                this.scene.add(skeletonHelper);

                // loaderAnim.remove();

                this.mixer = new THREE.AnimationMixer(this.model);

                let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

                idleAnim.tracks.splice(3, 3);
                idleAnim.tracks.splice(9, 3);

                let idle = this.mixer.clipAction(idleAnim);
                idle.timeScale = 0.5;
                // idle.play();
            },
            undefined, // We don't need this function
            function (error) {
                console.error(error);
            }
        );
        // const axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( axesHelper );
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

    }

    reset() { }

    render() {
        this.renderer.render(this.scene, this.camera);
    }



    show() { }

    update() { }

    angleBetween2D(u, v) {

        const denom = Math.sqrt(Math.pow(u.x, 2) + Math.pow(u.y, 2)) * Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

        if (denom === 0) { var theta = Math.PI / 2; }
        else { var theta = Math.acos((u.x * v.x + u.y * v.y) / denom); }

        // clamp, to handle numerical problems

        // return  MathUtils.clamp( theta, - 1, 1 )
        return theta;
    }

    anglesBetween3D(p1, p2, p3) {
        const u = (new THREE.Vector3).subVectors(p1, p2);
        const v = (new THREE.Vector3).subVectors(p3, p2);

        const teta_x = this.angleBetween2D(new THREE.Vector2(u.y, u.z), new THREE.Vector2(v.y, v.z));
        const teta_y = this.angleBetween2D(new THREE.Vector2(u.x, u.z), new THREE.Vector2(v.x, v.z));
        const teta_z = this.angleBetween2D(new THREE.Vector2(u.x, u.y), new THREE.Vector2(v.x, v.y));

        return { x: teta_x, y: teta_y, z: teta_z }
    }

    // anglesAndTransform3D(p1, p2, p3, normal_to_yz, normal_to_zx, normal_to_xy) {
    //     // l'axe y équivaut à 
    //     const u = (new THREE.Vector3).subVectors(p1, p2);
    //     const v = (new THREE.Vector3).subVectors(p3, p2);

    //     const teta_x = this.angleBetween2D(u.projectOnPlane(normal_to_yz), v.projectOnPlane(normal_to_yz));
    //     const teta_y = this.angleBetween2D(u.projectOnPlane(v), v.projectOnPlane(v));
    //     const teta_z = this.angleBetween2D(u.projectOnPlane(normal_to_xy), v.projectOnPlane(normal_to_xy));

    //     return { x: teta_x, y: teta_y, z: teta_z }
    // }

    
    update_data(body_pose) {

        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }

        this.body_pose = body_pose;

        if (this.neck) {
            this.apply_rotation(this.neck);
        }
        if (this.right_arm) {
            // this.apply_rotation(this.right_arm);
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
    }

    poseAngles(joint) {
        if (this.body_pose.length == 0) return;
        const pose_nose = new THREE.Vector3(this.body_pose[0].slice(0, 3)[0], this.body_pose[0].slice(0, 3)[1], this.body_pose[0].slice(0, 3)[2]);
        const pose_left_shoulder = new THREE.Vector3(this.body_pose[11].slice(0, 3)[0], this.body_pose[11].slice(0, 3)[1], this.body_pose[11].slice(0, 3)[2]);
        const pose_right_shoulder = new THREE.Vector3(this.body_pose[12].slice(0, 3)[0], this.body_pose[12].slice(0, 3)[1], this.body_pose[12].slice(0, 3)[2]);
        const pose_right_elbow = new THREE.Vector3(this.body_pose[14].slice(0, 3)[0], this.body_pose[14].slice(0, 3)[1], this.body_pose[14].slice(0, 3)[2]);
        const pose_right_wrist = new THREE.Vector3(this.body_pose[15].slice(0, 3)[0], this.body_pose[15].slice(0, 3)[1], this.body_pose[15].slice(0, 3)[2]);
        const pose_left_hip = new THREE.Vector3(this.body_pose[23].slice(0, 3)[0], this.body_pose[23].slice(0, 3)[1], this.body_pose[23].slice(0, 3)[2]);
        const pose_right_hip = new THREE.Vector3(this.body_pose[24].slice(0, 3)[0], this.body_pose[24].slice(0, 3)[1], this.body_pose[24].slice(0, 3)[2]);
        const pose_spine_2 = ((new THREE.Vector3).copy(pose_right_shoulder)).add(pose_left_shoulder).multiplyScalar(0.5).sub(new THREE.Vector3(0,0,0));
                 
        if (joint == this.neck) {
            //ATTENTION : point1 à point_articulation doivent former l'axe y du bone à pivoter
            var point1 = pose_nose;
            const neck =  ((new THREE.Vector3).copy(pose_right_shoulder)).add(pose_left_shoulder).multiplyScalar(0.5);
            const aine =  ((new THREE.Vector3).copy(pose_right_hip)).add(pose_left_hip).multiplyScalar(0.5);
            var point2 =  ((new THREE.Vector3).copy(neck)).add(aine).multiplyScalar(0.5);
            var point_articulation = pose_spine_2;
            
        }
        else if (joint == this.right_arm) {
            var point1 = pose_spine_2; 
            var point_articulation = pose_right_elbow;
            var point2 = pose_right_shoulder; 
            
        }
        else if (joint == this.right_fore_arm) {
            var point1 = pose_right_shoulder;
            var point_articulation = pose_right_wrist;
            var point2 = pose_right_elbow;
        }

        return this.anglesBetween3D(point1, point_articulation, point2);
    }

    apply_rotation(joint) {

        // joint.updateMatrixWorld();
        // var normalMatrix = new THREE.Matrix3().getNormalMatrix(joint.matrixWorld);
        // var normal = new THREE.Vector3(0, 1, 0);
        // var newNormal = normal.clone().applyMatrix3(normalMatrix).normalize();

        var pose_angles = this.poseAngles(joint); // retourne les angles du joint selon l'axe du monde par MediaPipe
        var avatar_angles = this.anglesBetween3D(joint.children[0].position, joint.position, joint.parent.position);
        // console.log("joint.children[0].name", joint.children[0].name);
        // console.log("joint..name", joint.name);
        // console.log("joint.parent.name", joint.parent.name);

        if (joint == this.neck) {
            // var default_avatar_angles = new THREE.Vector3(0, 0, 0);
            // var default_pose_angles = new THREE.Vector3(0, 0, 0);

            var targeted_avatar_angle_x = lerp(joint.rotation.x, avatar_angles.x - pose_angles.x, 0.05);
            var targeted_avatar_angle_y = lerp(joint.rotation.y, pose_angles.x - avatar_angles.x, 0.05);
            var targeted_avatar_angle_z = lerp(joint.rotation.z, pose_angles.z - avatar_angles.z, 0.05);
            // console.log("this.right_arm.children : ", this.right_arm.children[0].position);
            // console.log("joint.parent : ", joint.parent.name);
            // console.log("joint.parent.parent : ", joint.parent.parent.name);
        }
        else if (joint == this.right_arm) {
            // var default_avatar_angles = new THREE.Vector3(1, 0, 0);
            // var default_pose_angles = new THREE.Vector3(2.95, 0.7, 2.25);
            // var tp_x_coeff = 1;
            // tp_y_coeff = 1;
            // tp_z_coeff = 1;
            // rot_x_min = -100, rot_x_max = 100,
            //     rot_y_min = -100, rot_y_max = 100
            // rot_z_min = -100, rot_z_max = 100;
            // console.log(joint.parent.parent.name);

            // this.anglesBetween3D(point1, point_articulation, point2);

            var targeted_angle_x = (angles.x - default_pose_angles.x) * tp_x_coeff + default_avatar_angles.x;
            var targeted_angle_y = (angles.y - default_pose_angles.y) * tp_y_coeff + default_avatar_angles.y;
            var targeted_angle_z = (angles.z - default_pose_angles.z) * tp_z_coeff + default_avatar_angles.z;

        }
        else if (joint == this.right_fore_arm) {
            
        }

        // joint.rotation.x = targeted_avatar_angle_x;
        // joint.rotation.y = targeted_avatar_angle_y;
        // joint.rotation.z = targeted_avatar_angle_z;

        // console.log("pose_rotation_x : ", pose_angles.x);
        // console.log("pose_rotation_y : ", pose_angles.y);
        // console.log("pose_rotation_z : ", pose_angles.z);

        // console.log("joint.rotation.x : ", joint.rotation.x);
        // console.log("joint.rotation.y : ", joint.rotation.y);
        // console.log("joint.rotation.z : ", joint.rotation.z);
    }

}
