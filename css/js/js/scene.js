
import * as THREE from "three";

const canvas = document.querySelector("#cafe-canvas");
const fallback = document.querySelector("#visual-fallback");

if (canvas) {
  try {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 2.5, 8);
    camera.lookAt(0, 0.35, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.HemisphereLight(0xfff0d8, 0x60422f, 2.2));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(4, 6, 5);
    scene.add(light);

    const goldLight = new THREE.PointLight(0xc18b4c, 20);
    goldLight.position.set(-3, 3, 3);
    scene.add(goldLight);

    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    const cream = new THREE.MeshStandardMaterial({
      color: 0xf6ead8,
      roughness: 0.28
    });

    const coffeeBrown = new THREE.MeshStandardMaterial({
      color: 0x57331f,
      roughness: 0.2
    });

    const gold = new THREE.MeshStandardMaterial({
      color: 0xc59a5a,
      metalness: 0.65,
      roughness: 0.25
    });

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.62, 1.05, 48),
      cream
    );
    cupGroup.add(cup);

    const coffee = new THREE.Mesh(
      new THREE.CylinderGeometry(0.69, 0.69, 0.035, 48),
      coffeeBrown
    );
    coffee.position.y = 0.54;
    cupGroup.add(coffee);

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.16, 0.12, 48),
      gold
    );
    saucer.position.y = -0.59;
    cupGroup.add(saucer);

    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.09, 16, 40),
      cream
    );
    handle.position.set(0.78, 0.05, 0);
    cupGroup.add(handle);

    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x795034,
      roughness: 0.65
    });

    const beans = [];

    for (let i = 0; i < 8; i++) {
      const bean = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 16, 12),
        beanMaterial
      );

      const angle = (i / 8) * Math.PI * 2;
      bean.position.set(
        Math.cos(angle) * 1.65,
        Math.sin(i * 2) * 0.7,
        Math.sin(angle) * 0.6
      );

      bean.scale.set(1.35, 0.7, 0.65);
      scene.add(bean);
      beans.push(bean);
    }

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    window.addEventListener("resize", resize);
    resize();

    if (fallback) fallback.style.display = "none";

    function animate(time) {
      requestAnimationFrame(animate);

      cupGroup.rotation.y = Math.sin(time * 0.0005) * 0.2;
      cupGroup.position.y = Math.sin(time * 0.001) * 0.12;

      beans.forEach((bean, index) => {
        bean.rotation.x += 0.003;
        bean.rotation.y += 0.004;
        bean.position.y += Math.sin(time * 0.001 + index) * 0.001;
      });

      renderer.render(scene, camera);
    }

    animate(0);
  } catch (error) {
    console.error("Could not start the 3D cafe scene:", error);
  }
}
