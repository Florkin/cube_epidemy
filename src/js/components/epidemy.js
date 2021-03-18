import Cube from '../modules/cube'

const cube = new Cube()
const loader = document.getElementById('loader')
const container = document.getElementById('cube_container')

/**
 * Change 1st infected cube
 */
const changeStartCube = () => {
    cube.healAllCubes()
    cube.infectCube(cube.getInputsCoords())
}

const sizeScene = () => {
    const rect = container.getBoundingClientRect();
    const width = rect.width
    const height = window.innerHeight
    cube.renderer.setSize(width, height)
    cube.camera.aspect = width / height
    cube.camera.updateProjectionMatrix()
}

// Instanciate Cube and init 3D scene
window.onload = () => {
    loader.style.display = 'none'
    sizeScene()
    container.appendChild(cube.renderer.domElement)
}

// Handle window resize
window.addEventListener('resize', sizeScene)

// Attach HTML inputs
/*
    Naming inputs ID's is important here.
    The cube.inputs object attribute is generated like that:
    => document.getElementById('cube_size') will add cube.inputs.cubeSize = input
*/
cube.setHtmlInputs(
    document.getElementById('cube_size'),
    document.getElementById('show_axes'),
    document.getElementById('healthy_color'),
    document.getElementById('infected_color'),
    document.getElementById('pos_x'),
    document.getElementById('pos_y'),
    document.getElementById('pos_z')
)

// Display Cube
cube.display()

// Set first infected cube
cube.infectCube(cube.getInputsCoords())

// Inputs event listeners
cube.inputs.posX.addEventListener('change', changeStartCube)
cube.inputs.posY.addEventListener('change', changeStartCube)
cube.inputs.posZ.addEventListener('change', changeStartCube)
cube.inputs.showAxes.addEventListener('change', cube.renderAxes)
cube.inputs.healthyColor.addEventListener('change', cube.updateColors)
cube.inputs.infectedColor.addEventListener('change', cube.updateColors)

// Handle cube size change
cube.inputs.cubeSize.addEventListener('change', () => {
    cube.updateSize(cube.inputs.cubeSize.value)
    cube.infectCube(cube.getInputsCoords())
})


// Epidemy

const infectionStep = () => {
    cube.infectedCubes.forEach((infected) => {
        const neighbors = cube.getNeighbors(infected)
        neighbors.forEach((elem) => {
            cube.infectCube(elem)
        })
    })
}

const startEpidemy = () => {
    cube.epidemyStarted = true;
    infectionStep()
}

document.getElementById('start_epidemy_btn').addEventListener('click', startEpidemy)

