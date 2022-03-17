import React, { useEffect, useRef } from "react";
import * as THREE from "three";
type Props = {};

const FbxLoaderExample = (props: Props) => {
  const canvasRef = useRef(null);

  const init = () => {
    //Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    // Create camera object

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(112, 100, 400);

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    const DirLight = new THREE.DirectionalLight(0xffffff);
    DirLight.position.set(0, 200, 100);
    DirLight.castShadow = true;
    DirLight.shadow.camera.top = 180;
    DirLight.shadow.camera.bottom = -100;
    DirLight.shadow.camera.left = -120;
    DirLight.shadow.camera.right = 120;
    scene.add(DirLight);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as any,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ground
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000));
  };

  useEffect(() => {
    // Call init
  });
  return <canvas ref={canvasRef} />;
};

export default FbxLoaderExample;
