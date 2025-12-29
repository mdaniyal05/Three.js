import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const detail = 12;
const color = 0xffffff;
const intensity = 500;
const ringRadius = 10;
const objects = [];
let angle = 0;
const orbitSpeed = 0.01;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const loader = new THREE.TextureLoader();

const earthGroup = new THREE.Group();

const geometry = new THREE.IcosahedronGeometry(1, detail);

const earthMat = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});

const sunMat = new THREE.MeshPhongMaterial({
  emissive: 0xffff00,
});

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
});

const fresnelMat = getFresnelMat();

const earthMesh = new THREE.Mesh(geometry, earthMat);
const sunMesh = new THREE.Mesh(geometry, sunMat);
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
const glowMesh = new THREE.Mesh(geometry, fresnelMat);

// earthMesh.position.x = 10;
// lightsMesh.position.x = 10;
// cloudsMesh.position.x = 10;
// glowMesh.position.x = 10;

const stars = getStarfield({ numStars: 5000 });

// const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
// sunLight.position.set(-2, 0.5, 1.5);
const light = new THREE.PointLight(color, intensity);

cloudsMesh.scale.setScalar(1.003);
glowMesh.scale.setScalar(1.01);
sunMesh.scale.set(5, 5, 5);

earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
earthGroup.add(earthMesh);
earthGroup.add(lightsMesh);
earthGroup.add(cloudsMesh);
earthGroup.add(glowMesh);

scene.add(earthGroup);
scene.add(sunMesh);
scene.add(stars);
scene.add(light);
// scene.add(sunLight);

objects.push(sunMesh);

camera.position.set(0, 25, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  angle += orbitSpeed;

  earthGroup.position.x = ringRadius * Math.cos(angle);
  earthGroup.position.z = ringRadius * Math.sin(angle);

  earthMesh.rotation.y += 0.002;
  sunMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;

  renderer.render(scene, camera);
}

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();
window.addEventListener("resize", handleWindowResize, false);
