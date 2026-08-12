// Setup Scene, Camera, Renderer
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 3D PARTICLE GALAXY BACKGROUND ---
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

// Create particles scattered in 3D space
for (let i = 0; i < particleCount * 3; i += 3) {
  // Positions
  positions[i] = (Math.random() - 0.5) * 200;
  positions[i + 1] = (Math.random() - 0.5) * 200;
  positions[i + 2] = (Math.random() - 0.5) * 200;

  // Indigo and purple hues for accent
  colors[i] = 0.4 + Math.random() * 0.4;     // R
  colors[i + 1] = 0.4 + Math.random() * 0.2; // G
  colors[i + 2] = 0.9 + Math.random() * 0.1; // B
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particle Material
const material = new THREE.PointsMaterial({
  size: 0.8,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Interactive Mouse Effect
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5;
  mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Window Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Slow drift rotation
  particleSystem.rotation.y += 0.0008;
  particleSystem.rotation.x += 0.0004;

  // React smoothly to mouse movement
  particleSystem.rotation.y += mouseX * 0.005;
  particleSystem.rotation.x += mouseY * 0.005;

  renderer.render(scene, camera);
}

animate();