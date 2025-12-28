import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const fov = 90;
const near = 0.1;
const far = 1000;

const mapLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geometry = new THREE.IcosahedronGeometry(2, 10);
const material = new THREE.MeshStandardMaterial({
  map: mapLoader.load("./textures/earthlights1k.jpg"),
});
const earth = new THREE.Mesh(geometry, material);

const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000);

scene.add(earth);
scene.add(hemilight);

camera.position.z = 5;

function animate() {
  earth.rotation.x += 0.01;
  earth.rotation.y += 0.01;

  renderer.render(scene, camera);
  controls.update();
}
