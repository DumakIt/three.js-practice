import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { keyController } from "./KeyController";

// ----- 주제: PointerLockControls에 키보드 컨트롤 추가

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const meshes = [];
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({ color: `rgb(${Math.floor(50 + Math.random() * 205)},${Math.floor(50 + Math.random() * 205)},${Math.floor(50 + Math.random() * 205)})` });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    mesh.name = `box-${i}`;
    scene.add(mesh);

    meshes.push(mesh);
  }

  // Controls
  const dragControls = new DragControls(meshes, camera, renderer.domElement);
  dragControls.addEventListener("dragstart", (event) => {
    console.log(event.object.name);
  });

  const controls = new PointerLockControls(camera, renderer.domElement);
  controls.lock();

  addEventListener("keydown", (e) => {
    if (e.code === "MetaLeft") {
      controls.unlock();
    }
  });

  addEventListener("keyup", (e) => {
    if (e.code === "MetaLeft") {
      controls.lock();
    }
  });
  controls.addEventListener("lock", () => {
    dragControls.enabled = false;
  });
  controls.addEventListener("unlock", () => {
    dragControls.enabled = true;
  });

  // 키보드 컨트롤
  const keys = [];
  keyController(keys);
  const walk = () => {
    if (keys["KeyW"]) {
      controls.moveForward(0.02);
    }
    if (keys["KeyS"]) {
      controls.moveForward(-0.02);
    }
    if (keys["KeyA"]) {
      controls.moveRight(-0.02);
    }
    if (keys["KeyD"]) {
      controls.moveRight(0.02);
    }
  };

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // controls.update(delta);
    walk();
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
