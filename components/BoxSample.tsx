import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

type Props = {};

const BoxSample = (props: Props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a new scene
    const scene = new THREE.Scene();

    // Setup the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    //Setup the renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as any,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // The geometry of the object
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Light on the Object
    const light = new THREE.DirectionalLight(0xffffff);

    // By default the light is positioned at 0,0,0. need tochange that
    light.position.set(0, 20, 10);

    //set ambient light
    const ambient = new THREE.AmbientLight(0x00bb00);

    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);

    //Add the cube, light to Scene
    scene.add(cube);
    scene.add(light);
    scene.add(ambient);

    camera.position.z = 3;

    function render() {
      //   cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();
  });
  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
};

export default BoxSample;
