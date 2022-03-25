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
                    if (o.isBone && o.name === 'mixamorigHead') {
                        this.head = o;

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
                idle.timeScale = 0.5;
                idle.play();
            },
            undefined, // We don't need this function
            function (error) {
                console.error(error);
            }
        );
        this.cube_view = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({
                color: 0x00ff00
            })
        )
        this.cube_view.position.set(0,7.47,5);
        this.scene.add(
            this.cube_view
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
        const pose_mouth_left = new THREE.Vector3(this.body_pose[9].slice(0, 3)[0],this.body_pose[9].slice(0, 3)[1],this.body_pose[9].slice(0, 3)[2]);
        const pose_mouth_right = new THREE.Vector3(this.body_pose[10].slice(0, 3)[0],this.body_pose[10].slice(0, 3)[1],this.body_pose[10].slice(0, 3)[2]);
        
        const pose_left_shoulder = new THREE.Vector3(this.body_pose[11].slice(0, 3)[0],this.body_pose[11].slice(0, 3)[1],this.body_pose[11].slice(0, 3)[2]);
        const pose_right_shoulder = new THREE.Vector3(this.body_pose[12].slice(0, 3)[0],this.body_pose[12].slice(0, 3)[1],this.body_pose[12].slice(0, 3)[2]);
        // const pose_bwd_nose = (new THREE.Vector3).copy(pose_left_ear).add(pose_right_ear).multiplyScalar(0.5);
        const pose_mouth_middle = ((new THREE.Vector3).copy(pose_mouth_left)).add(pose_mouth_right).multiplyScalar(0.5);
        const pose_neck = ((new THREE.Vector3).copy(pose_left_shoulder)).add(pose_right_shoulder).multiplyScalar(0.5);    


        console.log("pose_nose.x : ", pose_nose.x);
        console.log("pose_nose.y : ", pose_nose.y);
        console.log("pose_nose.z : ", pose_nose.z);

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

            // var targeted_position_x = - pose_neck_angle.x*1.4 + 3;
            // var targeted_position_y = -pose_neck_angle.y*0.7 + 1;
            // var targeted_position_z = pose_neck_angle.z*1.5 + 3.5;
            var basic_head_position = new THREE.Vector3(0, 7.472, 2.145);
            
            // var actual_diff_x = targeted_position_x - this.neck.rotation.x ;
            // var actual_diff_y = targeted_position_y - this.neck.rotation.y ;
            // var actual_diff_z = targeted_position_z - this.neck.rotation.z ;
            
            // this.neck.rotation.x += actual_diff_x/10  ;
            // this.neck.rotation.y += actual_diff_y/10  ;
            // this.neck.rotation.z += actual_diff_z/10  ;

            // this.neck.rotation.x = lerp(this.neck.rotation.x, targeted_position_x, 0.1);
            // this.neck.rotation.y = lerp(this.neck.rotation.y, targeted_position_y, 0.6);
            // this.neck.rotation.z = lerp(this.neck.rotation.z, targeted_position_z, 0.6);
            
            var pose_looked_at_point = new THREE.Vector3() 

            // console.log("this.head.position.x : ", this.head.position.x);
            // console.log("this.head.position.y : ", this.head.position.y);
            // console.log("this.head.position.z : ", this.head.position.z);
            // var look_ray = (new THREE.Vector3(0,0,10)).applyAxisAngle(new THREE.Vector3(1,0,0), pose_neck_angle.x)
            // look_ray.applyAxisAngle ( new THREE.Vector3(0,1,0), pose_neck_angle.y )
            // look_ray .applyAxisAngle ( new THREE.Vector3(0,0,1), pose_neck_angle.z )

            var looked_at_point = (new THREE.Vector3).copy(basic_head_position).add(look_ray);
            // this.head.lookAt(looked_at_point); //head basic position : 0, 7.47, 2.14

            this.cube_view.position.set();

            // this.head.up = new THREE.Vector3(0,0,0);
            // console.log("this.neck.up : ", this.head.up);
            // console.log("this.neck.rotation.x : ", this.neck.rotation.x);
            // console.log("this.neck.rotation.y : ", this.neck.rotation.y);
            // console.log("this.neck.rotation.z : ", this.neck.rotation.z);
            // console.log("this.neck.rotation.x : ", targeted_position_x);
            // console.log("this.neck.rotation.y : ", targeted_position_y);
            // console.log("this.neck.rotation.z : ", targeted_position_z);
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
