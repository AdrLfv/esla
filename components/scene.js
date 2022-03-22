import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import {MathUtils} from 'https://unpkg.com/three@0.127.0/src/math/MathUtils.js'

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
        
    }

    onResults() {

        if (this.body_pose.length == 0) return;
        const pose_nose = new THREE.Vector3(this.body_pose[0].slice(0, 3)[0],this.body_pose[0].slice(0, 3)[1],this.body_pose[0].slice(0, 3)[2]);
        // const pose_left_ear = new THREE.Vector3(this.body_pose[7].slice(0, 3)[0],this.body_pose[7].slice(0, 3)[1],this.body_pose[7].slice(0, 3)[2]);
        const pose_right_ear = new THREE.Vector3(this.body_pose[8].slice(0, 3)[0],this.body_pose[8].slice(0, 3)[1],this.body_pose[8].slice(0, 3)[2]);
        const pose_left_shoulder = new THREE.Vector3(this.body_pose[11].slice(0, 3)[0],this.body_pose[11].slice(0, 3)[1],this.body_pose[11].slice(0, 3)[2]);
        const pose_right_shoulder = new THREE.Vector3(this.body_pose[12].slice(0, 3)[0],this.body_pose[12].slice(0, 3)[1],this.body_pose[12].slice(0, 3)[2]);
        // const pose_bwd_nose = (new THREE.Vector3).copy(pose_left_ear).add(pose_right_ear).multiplyScalar(0.5);
        const pose_neck = (new THREE.Vector3).copy(pose_left_shoulder).add(pose_right_shoulder).multiplyScalar(0.5);

        // const vec_nose_neck = (new THREE.Vector3).subVectors(pose_neck, pose_nose);
        // const vec_ls_neck = (new THREE.Vector3).subVectors(pose_left_shoulder, pose_neck);
        // const vec_neck_fn = (new THREE.Vector3).subVectors(pose_neck, pose_forward_neck); 

        // console.log("right_ear.z : ", pose_right_ear.z);
        // console.log("nose.z : ", pose_nose.z);


        // return {
            // x: vec_neck_fn.angleTo(vec_nose_neck),
            // y: vec_ls_neck.angleTo(vec_neck_fn), 
            // z: vec_nose_neck.angleTo(vec_neck_fn)

            // x: this.anglesBetween2D(vec_neck_fn.y, vec_neck_fn.z, vec_nose_neck.y, vec_nose_neck.z),
            // y: this.anglesBetween2D(vec_ls_neck.x, vec_ls_neck.z, vec_neck_fn.x, vec_neck_fn.z), 
            // z: this.anglesBetween2D(vec_nose_neck.x, vec_nose_neck.y, vec_neck_fn.x, vec_neck_fn.y)}
            
        return this.anglesBetween3D( pose_nose, pose_neck, pose_left_shoulder ) ;
        
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
            this.mixer.update(this.clock.getDelta());
        }

        this.body_pose = body_pose;
        if(this.neck)
        {
            var pose_neck_angle = this.onResults();
            var targeted_position = -pose_neck_angle.y*0.7 + 1.2
            var actual_diff_y = targeted_position - this.neck.rotation.y ;
            this.neck.rotation.y += actual_diff_y/10  ;//+ actual_diff_y/5;
            console.log("this.neck.rotation.y : ", this.neck.rotation.y);
            console.log("pose_neck_angle.y : ", pose_neck_angle.y);
        }
    }

    show() { }

    update() { }

    angleBetween2D( u,v ) {

		const denom = Math.sqrt( Math.pow(u.x , 2) + Math.pow(u.y , 2) ) * Math.sqrt( Math.pow(v.x , 2) + Math.pow(v.y , 2) );

		if ( denom === 0 ) { var theta = Math.PI / 2 ;}
        else { var theta = Math.acos((u.x*v.x+ u.y*v.y)/ denom); }

		// clamp, to handle numerical problems

		// return  MathUtils.clamp( theta, - 1, 1 )
        return theta;
	}

    anglesBetween3D(p1, p2, p3)
    {


        const u =  (new THREE.Vector3).subVectors(p1, p2);
        const v =  (new THREE.Vector3).subVectors(p3, p2);

        const teta_x = this.angleBetween2D(new THREE.Vector2(u.y,u.z), new THREE.Vector2(v.y,v.z));
        const teta_y = this.angleBetween2D(new THREE.Vector2(u.x,u.z), new THREE.Vector2(v.x,v.z));
        const teta_z = this.angleBetween2D(new THREE.Vector2(u.x,u.y), new THREE.Vector2(v.x,v.y));

        return {x:teta_x,y: teta_y, z: teta_z}
        
    }

    // subVectors( a, b ) {

	// 	return THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);

	// }

    //     angleBetween(u, v ) {

    // 		const denominator = Math.sqrt( this.lengthSq(u) * this.lengthSq(v) );

    // 		if ( denominator === 0 ) return Math.PI / 2;

    // 		const theta = u.dot( v ) / denominator;

    // 		// clamp, to handle numerical problems

    // 		return Math.acos( MathUtils.clamp( theta, - 1, 1 ) );

    // 	}

    //     lengthSq(u) {

    // 		return u.x * u.x + u.y * u.y + u.z * u.z;

    // 	}
}
