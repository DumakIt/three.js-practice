import * as THREE from "three";

export default function example() {
  // Renderer
  const canvas = document.querySelector("#threeCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.setClearColor("#00ff00");
  renderer.setClearAlpha(0.5);

  // Scene
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color("blue");

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1.5;
  camera.position.y = 1;
  camera.position.x = 1;
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#5f5f5f" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);

  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  // 이벤트
  window.addEventListener("resize", setSize);
}
