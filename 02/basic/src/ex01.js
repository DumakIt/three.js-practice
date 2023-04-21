import * as THREE from "three";

export default function example() {
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  // Renderer
  const canvas = document.querySelector("#threeCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  // PerspectiveCamera (원근 카메라)
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 2;
  camera.position.y = 1;
  camera.position.x = 1;
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Orthographic (직교 카메라)
  // const camera = new THREE.OrthographicCamera(-(window.innerWidth / window.innerHeight), window.innerWidth / window.innerHeight, 1, -1, 0.1, 1000);
  // camera.position.z = 1;
  // camera.position.y = 1;
  // camera.position.x = 1;
  // camera.lookAt(0, 0, 0);
  // camera.zoom = 0.5;
  // camera.updateProjectionMatrix();
  // scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#5f5f5f" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);
}
