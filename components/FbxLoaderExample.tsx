import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
type Props = {};
const loader = new FBXLoader();
const clock = new THREE.Clock();

const FbxLoaderExample = (props: Props) => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState<any>({});
  const [anims, setAnims] = useState<any>([]);
  const [animations, setAnimations] = useState<any>();
  const [action, setAction] = useState<any>();
  const [renderer, setRenderer] = useState<any>();
  const [sceneInst, setSceneInst] = useState<any>();
  const [cameraInst, setCameraInst] = useState<any>();
  const init = () => {
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(112, 100, 400);
    setCameraInst(camera);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    let light: any = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 280;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);

    // ground
    var mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0xaaffdd, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    //mesh.position.y = -100;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var grid: any = new THREE.GridHelper(2000, 40, 0xffaa23, 0x000000);
    //grid.position.y = -100;
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // model

    // const game = this;

    loader.load(`/fbx/people/FireFighter.fbx`, function (object: any) {
      object.mixer = new THREE.AnimationMixer(object);
      const playerWithMixer: any = { ...player };
      player.mixer = object.mixer;
      player.root = object.mixer.getRoot();

      object.name = "FireFighter";

      object.traverse(function (child: any) {
        if (child.isMesh) {
          // child.material.map = null;
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      const tLoader: any = new THREE.TextureLoader();

      tLoader.load(
        "/images/SimplePeople_FireFighter_Brown.png",
        function (texture: any) {
          object.traverse(function (child: any) {
            if (child.isMesh) {
              child.material.map = texture;
            }
          });
        }
      );

      scene.add(object);
      player.object = object;
      setAnimations({ Idle: object.animations[0] });
      setSceneInst(scene);
      //loadnextanim
      // player.mixer.clipAction(object.animations[0]).play();

      setPlayer({ ...player });

      // loadNextAnim(loader);
      // animate();
    });

    const rendererInst = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current as any,
    });
    rendererInst.setPixelRatio(window.devicePixelRatio);
    rendererInst.setSize(window.innerWidth, window.innerHeight);
    rendererInst.shadowMap.enabled = true;
    setRenderer(rendererInst);
    // this.container.appendChild(this.renderer.domElement);

    //   const renderer = new THREE.WebGLRenderer({
    //     canvas: canvasRef.current as any,
    //   });
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    //   renderer.shadowMap.enabled = true;
  };

  const animate = () => {
    const dt = clock.getDelta();
    requestAnimationFrame(function () {
      animate();
    });
    if (player.mixer !== undefined) player.mixer.update(dt);

    renderer.render(sceneInst, cameraInst);
  };

  let setActionName = (name: any) => {
    setAction(name);
    const Action = player.mixer.clipAction(animations[name]);
    console.log("animations :", animations);

    Action.time = 0;
    player.mixer.stopAllAction();
    player.action = name;
    player.actionTime = Date.now();
    player.actionName = name;
    Action.fadeIn = 0.5;
    Action.play();
  };

  const loadNextAnim = (loader: any) => {
    const anim = anims.pop();
    loader.load(`/fbx/anims/${anim}.fbx`, (object: any) => {
      animations[anim] = object.animations[0];
      setAnimations(animations);
      if (anims.length > 0) {
        loadNextAnim(loader);
      } else {
        setAnims(undefined);
        setActionName("Idle");
        animate();
      }
    });
  };

  useEffect(() => {
    setAnims(["Pointing Gesture"]);
  }, []);

  useEffect(() => {
    // Call init
    init();
  }, []);

  useEffect(() => {
    if (animations && anims && anims.length > 0 && sceneInst) {
      loadNextAnim(loader);
    }
  }, [animations, sceneInst]);

  useEffect(() => {
    if (renderer && cameraInst) {
      const controls = new OrbitControls(cameraInst, renderer.domElement);
      controls.target.set(0, 150, 0);
      controls.update();
    }
  }, [renderer, cameraInst]);

  const toggleAction = () => {
    if (action === "Idle") setActionName("Pointing Gesture");
    if (action === "Pointing Gesture") setActionName("Idle");
  };
  return (
    <>
      <canvas ref={canvasRef} />
      <button onClick={toggleAction}>Change Action</button>
    </>
  );
};

export default FbxLoaderExample;
