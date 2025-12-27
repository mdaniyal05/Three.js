import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const fov = 90;
const near = 0.1;
const far = 1000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.03;

const geometry = new THREE.IcosahedronGeometry(2, 3, 3);
const material = new THREE.MeshStandardMaterial({
  color: 0xcccfff,
  flatShading: true,
});
const mesh = new THREE.Mesh(geometry, material);

const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geometry, wireMaterial);

const hemilight = new THREE.HemisphereLight(0xb31307, 0x0718b3);

scene.add(mesh);
mesh.add(wireMesh);
scene.add(hemilight);

camera.position.z = 5;

function animate() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
  controls.update();
}
