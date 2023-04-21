import * as THREE from "three";

export default function example() {
  // Renderer
  const canvas = document.querySelector("#threeCanvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1.5;
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.position.z = 1.5;
  light.position.x = 1;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "#5f5f5f" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    // MathUtils.degToRad 흔히 우리가 아는 360도 개념
    // 이걸 안하고 그냥 숫자 넣으면 엄청 빨리 작동함
    // 이걸 하면 degToRad(1)을 넣으면 1도로 작동

    mesh.rotation.y += delta;
    mesh.position.y += delta;
    if (mesh.position.y > 1.5) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  // 이벤트

  window.addEventListener("resize", setSize);
  draw();
}
