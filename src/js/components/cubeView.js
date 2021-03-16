import Cube from '../modules/cube'

const cube = new Cube()

/**
 * Change 1st infected cube
 */
const changeStartCube = () => {
    cube.reInitCubesColor()
    cube.infectCube(cube.xInput.value, cube.yInput.value, cube.zInput.value)
}

// Instanciate Cube and init 3D scene
cube.renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('cube_container').appendChild(cube.renderer.domElement)

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    cube.renderer.setSize(width, height)
    cube.camera.aspect = width / height
    cube.camera.updateProjectionMatrix()
})

// Attach HTML inputs
cube.setHtmlInputs(
    document.getElementById('cube_size'),
    document.getElementById('pos_x'),
    document.getElementById('pos_y'),
    document.getElementById('pos_z')
)

// Display Cube
cube.display()

// Set first infected cube
cube.infectCube(cube.xInput.value, cube.yInput.value, cube.zInput.value)

// And change it when coordinates inputs changes
cube.xInput.addEventListener('change', changeStartCube)
cube.yInput.addEventListener('change', changeStartCube)
cube.zInput.addEventListener('change', changeStartCube)

// Handle cube size change
cube.sizeInput.addEventListener('change', () => {
    cube.updateSize(cube.sizeInput.value)
    cube.infectCube(cube.xInput.value, cube.yInput.value, cube.zInput.value)
})