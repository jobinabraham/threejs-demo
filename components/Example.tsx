import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BufferGeometry, Color } from "three";
const Example = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fov = 100;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.8;
    const far = 30;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
    // mesh.rotation.x = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as any,
      antialias: true,
    });

    const lightProps = {
      color: 0xffffff,
      intensity: 1,
    };

    const light = new THREE.DirectionalLight(
      lightProps.color,
      lightProps.intensity
    );

    light.position.set(-6, 6, -2);

    scene.add(light);

    renderer.setSize(window.innerWidth, window.innerHeight);

    // function render(time: any) {
    //   time *= 0.001; // convert time to seconds

    //   mesh.rotation.x = time;
    //   mesh.rotation.y = time;

    //   renderer.render(scene, camera);

    //   requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);

    function meshFactory(
      geometry: BufferGeometry,
      color: Color | number,
      x: number
    ) {
      const material = new THREE.MeshPhongMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      cube.position.x = x;
      return cube;
    }

    const cubes = [
      meshFactory(geometry, 0x44aa88, 0),
      meshFactory(geometry, 0xaa8844, -2),
      meshFactory(geometry, 0x44aa33, 2),
    ];

    function render(time: any) {
      time *= 0.001;
      cubes.forEach((cube, index) => {
        const speed = 1 * (index + 1) * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // renderer.setAnimationLoop(animation);

    // function animation(time: any) {
    //   mesh.rotation.x = time / 2000;
    //   // mesh.rotation.y = time / 1000;

    //   renderer.render(scene, camera);
    // }
    // animation();

    // renderer.render(scene, camera);

    // Cleanup on unmount, otherwise stuff will linger in GPU
    return () => {
      renderer.forceContextLoss();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Example;
