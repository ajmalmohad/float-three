import './src/styles/style.css';
import { home } from './src/components/home'
import { about } from './src/components/about'
import { contact } from './src/components/contact'
import Navigo from 'navigo';
import gsap from 'gsap'
import * as THREE from 'three'
import { CubicBezierCurve } from 'three';

//Root Element
let rootElement = document.getElementById('app')

//Three JS --------------------------------------------------------------------
//Global Vars and Initialization
let scene, camera, renderer, geometry, material, cube, texture;
let mouse = { x: 0, y: 0 }
init();
animate();

//Initialize Three JS Scene
function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0x379683, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute("id", "canvas")
    document.body.appendChild(renderer.domElement);
    
    geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    material = new THREE.MeshPhongMaterial({ color: 0x05386b, map: texture });
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = 1;
    scene.add(cube);

    var dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.x = 1;
    dl.position.z = 2;
    scene.add(dl);

    var al = new THREE.AmbientLight(0xffffff);
    al.intensity = 0.3;
    scene.add(al);
}

//Animate Three JS Scene/Objects
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.position.x = mouse.x;
    cube.position.y = mouse.y;
    renderer.render(scene, camera);
};

//Re-Render Scene on Window Resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//Track Mouse Move
function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}

//Load and Update Texture
let loader = new THREE.TextureLoader();
loader.load( '/src/images/daze.jpg', (texture)=>{
  console.log( "load complete:", texture )
  material.map = texture;
  cube.material.needsUpdate = true;
})

//Three JS --------------------------------------------------------------------



//Navigo  ----------------------------------------------------------------------
//Routing
const router = new Navigo('/');
router.on('/', () => {
    rootElement.innerHTML = home
    cube.geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    cube.geometry.needsUpdate = true;
    cube.material.needsUpdate = true;
    animateRoute('home')
});
router.on('/about', () => {
    rootElement.innerHTML = about
    cube.geometry = new THREE.IcosahedronGeometry(1.1);
    cube.geometry.needsUpdate = true;
    cube.material.needsUpdate = true;
    animateRoute('about')
});
router.on('/contact', () => {
    rootElement.innerHTML = contact
    cube.geometry = new THREE.SphereGeometry(1, 100, 100);
    cube.geometry.needsUpdate = true;
    cube.material.needsUpdate = true;
    animateRoute('contact')
});
router.resolve();
//Navigo  ----------------------------------------------------------------------



//GSAP  ------------------------------------------------------------------------
//Router Animations
function animateRoute(page) {
    animateCurtain()
    animateCurtain1()
    animatePage(page)
}

//Curtain Root Element Animations
function animateCurtain() {
    let anim = gsap.timeline()
    anim.to('#curtain', { display: "block", duration: 0 });
    anim.from("#curtain", { y: window.innerHeight, duration: 1 });
    anim.to('#curtain', { y: window.innerHeight, display: "none", duration: 1, delay: 0.6 });
    anim.to('#curtain', { y: 0, duration: 0 });
}

//Curtain Child Element Animations
function animateCurtain1() {
    let anim3 = gsap.timeline()
    anim3.to('#curtain1', { top: 0, duration: 0.8, delay: 0.1 });
    anim3.to('#curtain1', { top: "50vh", duration: 0.8, delay: 0.7 });
}

//Page Load Animations
function animatePage(page) {
    let anim2 = gsap.timeline()
    anim2.from(`#${page}`, { display: "none", duration: 0.8 });
    anim2.from(`#${page}`, { opacity: 0, duration: 0.8, delay: 1.2 });
}
//GSAP  ------------------------------------------------------------------------


//Event Listeners
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', (e) => { onMouseMove(e) });