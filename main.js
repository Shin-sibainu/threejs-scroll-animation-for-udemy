import "./style.css";
import * as THREE from "three";
import spaceBG from "./bg/space.jpg";

// Canvas
const canvas = document.querySelector("#webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(spaceBG);
scene.background = bgTexture;

//GridHelperの設定
const gridHelper = new THREE.GridHelper(30, 30);
// scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//オブジェクトの追加
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

/**
 * 線形補間
 * lerp(min, max, ratio)
 */
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

/**
 * lerpの補間率計算(第三引数用)
 **/
function scaleParcent(start, end) {
  return (scrollPercent - start) / (end - start);
}

/**
 * スクロールアニメーション関数定義
 */
const animationScripts = [];

/**
 * スクロールアニメーション開始関数
 */
animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40));
    torus.position.z = lerp(10, -20, scaleParcent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(2, Math.PI, scaleParcent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scaleParcent(60, 80));
    camera.position.y = lerp(1, 15, scaleParcent(60, 80));
    camera.position.z = lerp(10, 25, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
  function() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});

/**
 * スクロールアニメーション開始
 */
function playScollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent < animation.end) {
      animation.function();
    }
  });
}

/**
 * ブラウザのスクロール率を導出
 */
let scrollPercent = 0;

document.body.onscroll = () => {
  //現在スクロールの進捗をパーセントで算出する。
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  // console.log(scrollPercent);
};

//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  /**
   * スクロールアニメーション開始
   */
  playScollAnimation();

  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.scrollTo({ top: 0, behavior: "smooth" });
