import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { MySphere } from "./MySphere";

// ----- 주제: Performance(성능 좋게 하기)

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  directionalLight.castShadow = true;
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // 성능을 위한 셋팅
  cannonWorld.allowSleep = true;
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
  // SAPBroadphase // 퀄리티 저하도 안하면서 성능 저하도 안되는 (가장 많이 사용)
  // NavieBroadphase // 기본값
  // GridBroadphase // 구역을 나누어 테스트

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");

  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, { friction: 0.5, restitution: 0.3 });
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 0, 0), shape: floorShape, material: defaultMaterial });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  // Mesh
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: "slategray" }));
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2;
  scene.add(floorMesh);

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });

  // 그리기
  const clock = new THREE.Clock();

  const draw = () => {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    spheres.forEach((el) => {
      el.mesh.position.copy(el.cannonBody.position);
      el.mesh.quaternion.copy(el.cannonBody.quaternion);
    });
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  };

  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  const sound = new Audio("/sounds/boing.mp3");

  const collide = (event) => {
    const velocity = event.contact.getImpactVelocityAlongNormal();
    if (velocity > 3) {
      sound.currentTime = 0;
      sound.play();
    }
  };

  // 이벤트
  window.addEventListener("resize", setSize);
  window.addEventListener("click", () => {
    const mySphere = new MySphere({
      scene,
      cannonWorld,
      geometry: sphereGeometry,
      material: sphereMaterial,
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * 5 + 2,
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() + 0.2,
    });
    spheres.push(mySphere);
    mySphere.cannonBody.addEventListener("collide", collide);
  });
  const preventDragClick = new PreventDragClick(canvas);

  // 삭제하기
  const btn = document.createElement("button");
  btn.style.cssText = "position: absolute; left: 20px; top: 20px; font-size: 20px;";
  btn.innerHTML = "삭제";
  document.body.append(btn);

  btn.addEventListener("click", () => {
    spheres.forEach((el) => {
      el.cannonBody.removeEventListener("collide", collide);
      cannonWorld.removeBody(el.cannonBody);
      scene.remove(el.mesh);
    });
  });
  draw();
}
