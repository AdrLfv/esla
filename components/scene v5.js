// import * as THREE from './three/build/three.module.js';
// import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
// import { MathUtils } from './three/src/math/MathUtils.js'
// import { VertexNormalsHelper } from './three/examples/jsm/helpers/VertexNormalsHelper.js';
// import { FontLoader } from './three/examples/jsm/loaders/FontLoader.js';

// import * as THREE from "https://github.com/mrdoob/three.js/blob/master/build/three.module.js";
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { MathUtils } from 'https://unpkg.com/three@0.127.0/src/math/MathUtils.js'
import { VertexNormalsHelper } from 'https://unpkg.com/three@0.127.0/examples/jsm/helpers/VertexNormalsHelper.js';
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
                        this.waist = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightShoulder') {
                        this.right_shoulder = o;
                        var right_shoulder_axes = new THREE.AxesHelper(20);
                        this.right_shoulder.add(right_shoulder_axes);
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftShoulder') {
                        this.left_shoulder = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightArm') {
                        this.right_arm = o;

                        var right_arm_axes = new THREE.AxesHelper(20);
                        this.right_arm.add(right_arm_axes);

                       
                        // this.right_arm.rotation = {x:0,y:0,z:0}

                        // var normalMatrix = new THREE.Matrix3().getNormalMatrix(this.right_arm.matrixWorld);
                        // var normal_x = new THREE.Vector3(1, 0, 0);
                        // var normal_y = new THREE.Vector3(0, 1, 0);
                        // var normal_z = new THREE.Vector3(0, 0, 1);
                        // this.right_arm_x_local_basic_axis = normal_x.clone().applyMatrix3(normalMatrix).normalize();
                        // this.right_arm_y_local_basic_axis = normal_y.clone().applyMatrix3(normalMatrix).normalize();
                        // this.right_arm_z_local_basic_axis = normal_z.clone().applyMatrix3(normalMatrix).normalize();

                        // this.right_arm.rotation.x = Math.PI/4; // Math.PI/2;
                        // this.right_arm.rotation.y = 0;  
                        // this.right_arm.rotation.z = 0;  
                    }
                    else if (o.isBone && o.name === 'mixamorigRightForeArm') {
                        this.right_fore_arm = o;
                        // this.right_fore_arm.rotation.x = 0; // Math.PI/2;
                        // this.right_fore_arm.rotation.y = 0;  
                        // this.right_fore_arm.rotation.z = 0;  
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftArm') {
                        this.left_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigLeftForeArm') {
                        this.left_fore_arm = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigRightLeg') {
                        this.right_leg = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine1') {
                        this.spine_1 = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigSpine2') {
                        this.spine_2 = o;
                    }
                    else if (o.isBone && o.name === 'mixamorigHips') {
                        this.hips = o;
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
                this.model.visible = false;
                // loaderAnim.remove();

                // this.mixer = new THREE.AnimationMixer(this.model);

                // let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

                // idleAnim.tracks.splice(3, 3);
                // idleAnim.tracks.splice(9, 3);

                // let idle = this.mixer.clipAction(idleAnim);
                // idle.timeScale = 0.5;
                // idle.play();
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

    angleBetweenVectors2D(u, v) {
        // const denom = Math.sqrt(Math.pow(u.x, 2) + Math.pow(u.y, 2)) * Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

        // if (denom === 0) { var theta = Math.PI / 2; }
        // else { var theta = Math.acos((u.x * v.x + u.y * v.y) / denom); }

        // clamp, to handle numerical problems

        // return  MathUtils.clamp( theta, - 1, 1 )
        // return theta;
        return Math.atan2(u.x*v.y - u.y*v.x, u.x*v.x+u.y*v.y);

    }

    test_angleBetweenVectors2D()
    {
        console.log(this.angleBetweenVectors2D(new THREE.Vector2(5,0), new THREE.Vector2(5,5)));
    }

    anglesOf(u) {
        // const teta_x = this.angleBetween2D(new THREE.Vector2(u.y, u.z), new THREE.Vector2(v.y, v.z));
        // const teta_y = this.angleBetween2D(new THREE.Vector2(u.x, u.z), new THREE.Vector2(v.x, v.z));
        // const teta_z = this.angleBetween2D(new THREE.Vector2(u.x, u.y), new THREE.Vector2(v.x, v.y));

        // return { x: teta_x, y: teta_y, z: teta_z }
        return { x: u.angleTo(new THREE.Vector3(1,0,0)), y : u.angleTo(new THREE.Vector3(0,1,0)), z : u.angleTo(new THREE.Vector3(0,0,1))}

    }
    testAnglesOf()
    {
        console.log(this.anglesOf(new THREE.Vector3(5,5,0)));
        // console.log(this.anglesBetweenWorld(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0), new THREE.Vector3(15,-15,0)));
        // console.log(this.anglesBetweenWorld(new THREE.Vector3(0,1,0), new THREE.Vector3(-15,15,0),new THREE.Vector3(0,0,0)));
    }
    anglesBetweenLocal(u, x_axis, y_axis, z_axis) {
        // l'axe y équivaut à 
        // const u = (new THREE.Vector3).subVectors(p1, p2);

        // const teta_x = this.angleBetween2D(u.projectOnPlane(x_axis), v.projectOnPlane(x_axis));
        // const teta_y = this.angleBetween2D(u.projectOnPlane(y_axis), v.projectOnPlane(y_axis));
        // const teta_z = this.angleBetween2D(u.projectOnPlane(z_axis), v.projectOnPlane(z_axis));

        return u.angleTo(x_axis, y_axis, z_axis);

    }
    anglesBetweenVectors3D(u,v)
    {
        const teta_x = this.angleBetweenVectors2D(new THREE.Vector2(u.y, u.z), new THREE.Vector2(v.y, v.z));
        const teta_y = this.angleBetweenVectors2D(new THREE.Vector2(u.x, u.z), new THREE.Vector2(v.x, v.z));
        const teta_z = this.angleBetweenVectors2D(new THREE.Vector2(u.x, u.y), new THREE.Vector2(v.x, v.y));

        return { x: teta_x, y: teta_y, z: teta_z }
    }
    testAnglesBetweenVectors3D()
    {
        console.log(this.anglesBetweenVectors3D(new THREE.Vector3(1,0,0), new THREE.Vector3(5,5,0)));
    }

    

    update_data(body_pose) {
        // this.test_angleBetween2D();
        // if (this.mixer) {
        //     this.mixer.update(this.clock.getDelta());
        // }
        // this.testAnglesBetweenWorld();

        // console.log("this.spine_2.rotation : ", this.spine_2.rotation);
        // console.log("this.right_shoulder.rotation : ", this.right_shoulder.rotation);
        // console.log("this.right_arm.rotation : ", this.right_arm.rotation);
        // this.testAnglesBetweenVectors3D()
        // this.test_angleBetweenVectors2D()
        // const vec = new THREE.Vector3();
        // this.right_shoulder.getWorldPosition(vec)
        // console.log("this.right_shoulder.position : ", vec);
        // this.spine_2.getWorldPosition(vec)
        // console.log("this.spine_2.position : ", vec);
        // this.right_leg.getWorldPosition(vec)
        // console.log("this.right_leg.position : ", vec);
        // this.hips.getWorldPosition(vec)
        // console.log("this.hips.position : ", vec);
        // this.right_arm.getWorldPosition(vec)
        // console.log("this.right_arm.position : ", vec);

        // console.log(this.right_shoulder.position.y - this.hips.position.y);
        // console.log(this.spine_2.position.y - this.hips.position.y);


        this.body_pose = body_pose;
        
        if (this.neck) {
            // this.apply_rotation(this.neck);
        }
        
        if (this.right_shoulder) {
            this.apply_rotation(this.right_shoulder);
            // this.right_shoulder.rotation.x = 0;
            // this.right_shoulder.rotation.y = 0;
            // this.right_shoulder.rotation.z = 0;

            // console.log("this.right_shoulder.children[0].name", this.right_shoulder.children[0].name);
            // console.log("this.right_shoulder.name", this.right_shoulder.name);
            // console.log("this.right_shoulder.parent.name", this.right_shoulder.parent.name);

            // console.log(this.right_shoulder.rotation);

            
        }
        if (this.right_arm) {
            // this.apply_rotation(this.right_arm);
            
            // this.right_arm.rotateZ(0.01);

            // var normalMatrix = new THREE.Matrix3().getNormalMatrix(this.right_arm.matrixWorld);
            // var normal_y = new THREE.Vector3(0, 1, 0);
            // var joint_y_local_axis = normal_y.clone().applyMatrix3(normalMatrix).normalize();

            // console.log(this.right_arm.rotation);
            // console.log(this.right_arm);
            // console.log(joint_y_local_axis);
            // console.log(joint_y_local_axis.angleTo(this.right_arm_x_local_basic_axis));
            // console.log(joint_y_local_axis.angleTo(this.right_arm_y_local_basic_axis));
            // console.log(joint_y_local_axis.angleTo(this.right_arm_z_local_basic_axis));

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
        const pose_spine_2 = ((new THREE.Vector3).copy(pose_right_shoulder)).add(pose_left_shoulder).multiplyScalar(0.5).multiplyScalar(0.728);
        // console.log(pose_right_wrist);         
        if (joint == this.neck) {
            //ATTENTION : point1 à point_articulation doivent former l'axe y du bone à pivoter
            const vec_no_s2 = joint.worldToLocal((new THREE.Vector3).subVectors(pose_nose, pose_spine_2));
            const vec_rs_s2 = joint.worldToLocal((new THREE.Vector3).subVectors(pose_right_shoulder, pose_spine_2));
            const vec_mr_ml = joint.worldToLocal((new THREE.Vector3).subVectors(pose_mouth_right, pose_mouth_left));
            const result =  this.anglesBetweenVectors3D(vec_mr_ml, vec_rs_s2 );
            
            // result.z = this.anglesBetweenWorld(vec_mr_ml,vec_rs_s2 ).z;
            // result.y = this.anglesBetweenVectors3D(vec_mr_ml,vec_rs_s2 ).y;

            return result;
        }
        else if (joint == this.right_arm) {
            var point1 = pose_spine_2; 
            var point_articulation = pose_right_shoulder;
            var point2 = pose_right_elbow; 
            // const vec_ex1 = (new THREE.Vector3).subVectors(point1, point_articulation);
            // const vec_ex2 = (new THREE.Vector3).subVectors(point2, point_articulation);
            const vec_ex1 = joint.worldToLocal((new THREE.Vector3).subVectors(point1, point_articulation));
            const vec_ex2 = joint.worldToLocal((new THREE.Vector3).subVectors(point2, point_articulation));
            return(this.anglesBetweenVectors3D(vec_ex1, vec_ex2));
        }
        else if (joint == this.right_fore_arm) {
            var point1 = pose_right_shoulder;
            var point_articulation = pose_right_wrist;
            var point2 = pose_right_elbow;
        }
    }

    apply_rotation(joint) {
        // joint.updateMatrixWorld();
        var pose_angles = this.poseAngles(joint); // retourne les angles du joint selon l'axe du monde par MediaPipe
        
        // var avatar_angles = this.anglesBetweenLocal(joint_y_local_axis, ); //, joint.children[0].position, joint.position, joint.parent.position

        if (joint == this.neck) {
            // avatar_angles = this.anglesBetweenWorld(joint.children[0].position, joint.position, this.right_shoulder.position);
            // var default_avatar_angles = new THREE.Vector3(0, 0, 0);
            // var default_pose_angles = new THREE.Vector3(2.9, 0, 3);
            // var tp_x_coeff = 1;
            // var tp_y_coeff = 1;
            // var tp_z_coeff = 1;
            var targeted_avatar_angle_x = Math.PI - pose_angles.x ;
            var targeted_avatar_angle_y = Math.PI - pose_angles.y ;
            var targeted_avatar_angle_z = Math.PI - pose_angles.z ;
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
            // const vec_pose = new THREE.Vector3(5,5,0); // on imagine que la pose est égal à ce vecteur
            // var targeted_avatar_angle_x = 2*(pose_angles.x )- Math.PI;
            // var targeted_avatar_angle_y = pose_angles.y;
            // var targeted_avatar_angle_z = pose_angles.z- Math.PI/2;
            
            var targeted_avatar_angle_x = Math.PI - pose_angles.x ;
            var targeted_avatar_angle_y = Math.PI - pose_angles.y ;
            var targeted_avatar_angle_z = Math.PI - pose_angles.z ;

        }
        else if (joint == this.right_fore_arm) {
            
        }
        // const targeted_avatar_angle_x = avatar_angles.x - (pose_angles.x - default_pose_angles.x) + default_avatar_angles.x;
        // const targeted_avatar_angle_y =  tp_y_coeff * ( pose_angles.y - default_pose_angles.y) ;
        // const targeted_avatar_angle_z = avatar_angles.z - (pose_angles.z - default_pose_angles.z) + default_avatar_angles.z;
        joint.rotation.order = "YZX";
        joint.rotation.x = lerp(joint.rotation.x, - targeted_avatar_angle_x, 0.01);
        joint.rotation.y = lerp(joint.rotation.y,  - targeted_avatar_angle_y, 0.01);
        joint.rotation.z = lerp(joint.rotation.z, - targeted_avatar_angle_z, 0.01);

        // console.log("this.anglesBetweenWorld(joint_y_axis) : ", this.anglesBetweenWorld(joint_y_axis));

        // console.log("joint_y : ",  joint_y);
        // joint.rotation.x = 3*Math.PI/4;
        // joint.rotation.z = 3*Math.PI/4;
        // joint.rotateY(0.01);
        // console.log("joint_y : ",  joint_y);

        console.log("targeted_avatar_angle_x : ", targeted_avatar_angle_x);
        console.log("targeted_avatar_angle_y : ", targeted_avatar_angle_y);
        console.log("targeted_avatar_angle_z : ", targeted_avatar_angle_z);

        console.log("joint.rotation.x : ", joint.rotation.x);
        console.log("joint.rotation.y : ", joint.rotation.y);
        console.log("joint.rotation.z : ", joint.rotation.z);
    }
    //récupérer les axis du joint étudié
    //calculer l'angle entre la pose et les axis du joint
    //set la rotation du joint sur cet angle
}
