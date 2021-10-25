import * as BABYLON from 'babylonjs';

// // Get the canvas DOM element
// const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
// // Load the 3D engine
// const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
// // CreateScene function that creates and return the scene
// const createScene = () => {
//   // Create a basic BJS Scene object
//   const scene = new BABYLON.Scene(engine);
//   // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
//   const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
//   // Target the camera to scene origin
//   camera.setTarget(BABYLON.Vector3.Zero());
//   // Attach the camera to the canvas
//   camera.attachControl(canvas, false);
//   // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
//   const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
//   // Create a built-in "sphere" shape using the SphereBuilder
//   const sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);
//   // Move the sphere upward 1/2 of its height
//   sphere.position.y = 1;
//   // Create a built-in "ground" shape;
//   const ground = BABYLON.MeshBuilder.CreateGround('ground1', {
//     width: 6, height: 6, subdivisions: 2, updatable: false,
//   }, scene);
//   // Return the created scene
//   return scene;
// };
// // call the createScene function
// const scene = createScene();
// // run the render loop
// engine.runRenderLoop(() => {
//   scene.render();
// });
// // the canvas/window resize event handler
// window.addEventListener('resize', () => {
//   engine.resize();
// });

const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
const physicsPlugin = new BABYLON.CannonJSPlugin();

const createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
  // const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
  const sphere = BABYLON.Mesh.CreateBox('sphere1', 2, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = 2;

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  const ground = BABYLON.Mesh.CreateGround('ground1', 12, 3, 2, scene);

  scene.enablePhysics(gravityVector, physicsPlugin);

  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
  ground.physicsImpostor.friction = 0.01;

  // imposter.friction = 0.1; //set friction.

  canvas.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log(event.key);
    switch (event.key) {
      case 'a': {
        sphere.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(-1, 0, 0));
        break;
      }
      case 'd': {
        sphere.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(1, 0, 0));

        break;
      }
      case 'w': {
        sphere.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(0, 1, 0));

        break;
      }
      default: {
        break;
      }
    }
  });

  canvas.addEventListener('keyup', (event: KeyboardEvent) => {
    console.log(event.key);
    switch (event.key) {
      case 'a': {
        if (event.shiftKey) {

        } else {
          sphere.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        }
        break;
      }
      case 'd': {
        sphere.physicsImpostor?.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));

        break;
      }

      default: {
        break;
      }
    }
  });

  return scene;
};

const scene = createScene();
// run the render loop
engine.runRenderLoop(() => {
  scene.render();
});
