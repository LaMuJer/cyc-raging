import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import fragmentShader from './shaders/water/fragment.glsl'
import vertexShader from './shaders/water/vertex.glsl'

const debugObj = {}

/**
 * Base
 */
// Debug
// let gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)
// const waterGeometry = new THREE.SphereGeometry(1,64,64 , 32, 32)
// const waterGeometry = new THREE.TorusGeometry(1, 0.4, 8, 6)
// const waterGeometry = new THREE.BoxGeometry(1,3,.5 , 128, 128, 128)
const waterGeometry = new THREE.CylinderGeometry(1,1,5,128,128, true)
// const waterGeometry = new THREE.TorusKnotGeometry(1,0.4,64,32, 20, 20)
// const waterGeometry = new THREE.DodecahedronGeometry(1, 100)
// const waterGeometry = new THREE.RingGeometry( .5, 3, 128 );

//Color
debugObj.depthColor = "#2a2fc6"
debugObj.surfaceColor = "#59ff00"

// Material
const waterMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5 ) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.2 },
        uSmallWavesFrequency: { value: 8.261 },
        uSmallWavesSpeed: { value: 0.333 },
        uSmallWaveIterations: { value : 4.0 },

        uDepthColor : { value: new THREE.Color(debugObj.depthColor) },
        uSurfaceColor : { value: new THREE.Color(debugObj.surfaceColor) },
        uColorOffset : { value: 0.279 },
        uColorMultiplier: { value: 1.98 },
    }
})

//  Debug
// gui.add(waterMaterial.uniforms.uBigWavesElevation , 'value' , 0 , 1 , 0.001 ).name("uBigWavesElevation")
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value , 'x' , 0 , 10 , 0.001 ).name("uBigWavesFrequencyX")
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value , 'y' , 0 , 10 , 0.001 ).name("uBigWavesFrequencyY")
// gui.add(waterMaterial.uniforms.uBigWavesSpeed , 'value' , 0 , 5 , 0.001 ).name("uBigWavesSpeed")
//
// gui.add(waterMaterial.uniforms.uSmallWavesElevation , 'value' , 0 , 1 , 0.001 ).name("uSmallWavesElevation")
// gui.add(waterMaterial.uniforms.uSmallWavesFrequency , 'value' , 0 , 30 , 0.001 ).name("uSmallWavesFrequency")
// gui.add(waterMaterial.uniforms.uSmallWavesSpeed , 'value' , 0 , 5 , 0.001 ).name("uSmallWavesSpeed")
// gui.add(waterMaterial.uniforms.uSmallWaveIterations , 'value' , 0 , 10 , 1 ).name("uSmallWaveIterations")


// gui.addColor(debugObj, 'depthColor' )
//     .onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObj.depthColor))
// gui.addColor(debugObj, 'surfaceColor' )
//     .onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObj.surfaceColor))
// gui.add(waterMaterial.uniforms.uColorOffset, 'value' , 0 , 10, 0.001 ).name("uColorOffset")
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value' , 0 , 10, 0.001 ).name("uColorMultiplier")

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, -3 )
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableRotate = false
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Mouse
const mouse = new THREE.Vector2()
mouse.x = 0
mouse.y = 0

window.addEventListener("mousemove" , (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update Objects
    water.rotation.z = mouse.x * 0.00009

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()