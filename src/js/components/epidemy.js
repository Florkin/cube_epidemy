import Cube from '../modules/cube'

const cube = new Cube()
const loader = document.getElementById('loader')
const container = document.getElementById('cube_container')
const startEpidemyBtn = document.getElementById('start_epidemy_btn')
const epidemyStepBtn = document.getElementById('epidemy_step_btn')
const autoEpidemyBtn = document.getElementById('auto_epidemy_btn')
const configSection = document.getElementById('config')
const epidemySection = document.getElementById('epidemy')
let day = 1
const reInitCubeEvent = new Event('reInitCube')

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
    const height = window.innerWidth >= 992 ? window.innerHeight : window.innerHeight / 2
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
// TODO Too much repeat, Refactor this
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
// TODO Too much repeat, Refactor this
cube.inputs.posX.addEventListener('change', changeStartCube)
cube.inputs.posY.addEventListener('change', changeStartCube)
cube.inputs.posZ.addEventListener('change', changeStartCube)
cube.inputs.showAxes.addEventListener('change', cube.renderAxes)
cube.inputs.healthyColor.addEventListener('change', cube.updateColors)
cube.inputs.infectedColor.addEventListener('change', cube.updateColors)

// Handle cube size change
cube.inputs.cubeSize.addEventListener('change', () => {
    cube.updateSize(cube.inputs.cubeSize.value)
    document.dispatchEvent(reInitCubeEvent);
    cube.infectCube(cube.getInputsCoords())
})


// Epidemy
const toggleSection = (elem) => {
    if (elem.classList.contains('d-none')) {
        elem.classList.remove('d-none')
    } else {
        elem.classList.add('d-none')
    }
}

const showDay = (entry) => {
    const elem = entry.querySelector('.day')
    elem.innerHTML = day
}

const showInfectedNumber = (entry) => {
    const elem = entry.querySelector('.infected_number')
    elem.innerHTML = cube.getInfectedNumber().toString()
}

const showTotal = (entry) => {
    const elem = entry.querySelector('.total_number')
    elem.innerHTML = cube.getTotalNumber().toString()
}

const showPercentage = (entry) => {
    const elem = entry.querySelector('.percentage')
    elem.innerHTML = cube.getPercentage().toString()
}

const addDiaryEntry = () => {
    const template = document.getElementById('diary-entry-1').cloneNode(true)
    day += 1
    template.id = 'diary-entry-' + day
    showDay(template)
    showInfectedNumber(template)
    showTotal(template)
    showPercentage(template)
    const diarySection = document.getElementById('diary')
    diarySection.appendChild(template)
    diarySection.scroll({
        top: 10000000
    })
}

const startEpidemy = () => {
    cube.epidemyStarted = true;
    const diaryEntry = document.getElementById('diary-entry-1')
    toggleSection(configSection);
    toggleSection(epidemySection);
    showTotal(diaryEntry)
    showPercentage(diaryEntry)
}

const endEpidemy = () => {
    epidemyStepBtn.classList.add('d-none')
    autoEpidemyBtn.classList.add('d-none')
    document.getElementById('end-alert').classList.remove('d-none')
}

const infectionStep = () => {
    if (cube.getInfectedNumber() == cube.getTotalNumber()) {
        return endEpidemy()
    }
    cube.infectionStep()
    addDiaryEntry()
}

const autoEpidemy = () => {
    autoEpidemyBtn.classList.add('d-none')
    epidemyStepBtn.classList.add('d-none')
    const interval = setInterval(() => {
        if (cube.getInfectedNumber() == cube.getTotalNumber()) {
            clearInterval(interval)
        }
        infectionStep()
    }, 200)
}

startEpidemyBtn.addEventListener('click', startEpidemy)
epidemyStepBtn.addEventListener('click', infectionStep)
autoEpidemyBtn.addEventListener('click', autoEpidemy)
