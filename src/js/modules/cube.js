import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const camelCase = require('camelcase');

function Cube() {
    this.colors = {
        healthyColor: new THREE.Color('#F0E7D8'),
        lineColor: new THREE.Color('#000000'),
        infectedColor: new THREE.Color('#61210F'),
        white: new THREE.Color('#f8f8f8'),
    }

    this.epidemyStarted = false

    this.size = 3

    this.cubes = []
    this.infectedCubes = []

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
    })

    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.setHtmlInputs = (...inputs) => {
        this.inputs = []
        inputs.forEach((input) => {
            this.inputs[camelCase(input.id)] = input
        })
    }

    this.updateColors = () => {
        this.colors.healthyColor = new THREE.Color(this.inputs.healthyColor.value)
        this.colors.infectedColor = new THREE.Color(this.inputs.infectedColor.value)
        const cube = this
        this.cubes.forEach((elem) => {
            cube.scene.getObjectByName(elem).material.color.set(this.colors.healthyColor)
        })
        this.infectedCubes.forEach((elem) => {
            cube.scene.getObjectByName(elem).material.color.set(this.colors.infectedColor)
        })
    }

    this.setPositionInputs = () => {
        const offset = this.size % 2 === 0 ? 1 : 0
        const min = -Math.floor(this.size / 2) + offset
        const max = Math.floor(this.size / 2)
        this.inputs.posX.value = 0
        this.inputs.posY.value = 0
        this.inputs.posZ.value = 0
        this.inputs.posX.setAttribute('min', min)
        this.inputs.posX.setAttribute('max', max)
        this.inputs.posY.setAttribute('min', min)
        this.inputs.posY.setAttribute('max', max)
        this.inputs.posZ.setAttribute('min', min)
        this.inputs.posZ.setAttribute('max', max)
    }

    this.renderAxes = () => {
        if (this.inputs.showAxes.checked) {
            const axesHelper = new THREE.AxesHelper(this.size)
            axesHelper.name = 'axe_helper'
            this.scene.add(axesHelper)
        } else {
            this.scene.remove(this.scene.getObjectByName('axe_helper'))
        }
    }

    this.addLight = () => {
        const light1 = new THREE.DirectionalLight(this.colors.white, 1)
        const light2 = new THREE.DirectionalLight(this.colors.white, 1)
        light1.position.set(-1, 2, 4)
        light2.position.set(1, -1, -2)
        this.scene.add(light1)
        this.scene.add(light2)
    }

    this.addCube = (posX, posY, posZ) => {
        // Cube constants
        const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
        const edges = new THREE.EdgesGeometry(geometry)
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: this.colors.healthyColor,
            wireframe: false,
        })
        const lineMaterial = new THREE.LineBasicMaterial({
            color: this.colors.lineColor,
        })
        const cube = new THREE.Mesh(geometry, cubeMaterial)
        const line = new THREE.LineSegments(edges, lineMaterial)

        cube.position.x = posX
        cube.position.y = posY
        cube.position.z = posZ
        line.position.x = posX
        line.position.y = posY
        line.position.z = posZ
        cube.name = posX + ',' + posY + ',' + posZ
        this.cubes.push(cube.name)
        this.scene.add(line)
        this.group.add(cube)
    }

    this.initCube = () => {
        this.group = new THREE.Group();
        const offset = this.size % 2 === 0 ? 1 : 0
        const floor = Math.floor(this.size / 2)
        let x
        let y
        let z
        for (x = -floor + offset; x <= floor; x += 1) {
            for (y = -floor + offset; y <= floor; y += 1) {
                for (z = -floor + offset; z <= floor; z += 1) {
                    this.addCube(x, y, z)
                }
            }
        }
        this.scene.add(this.group)
    }

    this.clearCube = () => {
        for (let i = this.scene.children.length - 1; i >= 0; i -= 1) {
            this.scene.remove(this.scene.children[i])
        }
        this.cubes = []
    }

    this.render = () => {
        this.scene.background = this.colors.white
        this.renderer.render(this.scene, this.camera)
    }

    this.animate = () => {
        requestAnimationFrame(this.animate)
        this.render()
    }

    this.healAllCubes = () => {
        const cube = this
        this.infectedCubes = []
        this.cubes.forEach((elem) => {
            cube.scene.getObjectByName(elem).material.color.set(cube.colors.healthyColor)
        })
    }

    this.getInputsCoords = () => {
        return this.convertCoords([
            this.inputs.posX.value,
            this.inputs.posY.value,
            this.inputs.posZ.value
        ])
    }

    this.convertCoords = (elem) => {
        if (Array.isArray(elem)) {
            return elem.toString()
        }
        return elem.split(',').map(elem => parseInt(elem, 10))
    }

    this.infectCube = (name) => {
        if (this.cubes.includes(name) && !this.infectedCubes.includes(name)) {
            const cube = this.scene.getObjectByName(name)
            if (cube) {
                cube.material.color.set(this.colors.infectedColor)
            }
            this.infectedCubes.push(name)
        }
    }

    this.getNeighbors = (infected) => {
        const coords = this.convertCoords(infected)
        let neighbors = []
        let tempPlus
        let tempMinus
        coords.forEach((coord, index) => {
            tempPlus = JSON.parse(JSON.stringify(coords))
            tempMinus = JSON.parse(JSON.stringify(coords))
            tempPlus[index] += 1
            tempMinus[index] -= 1
            neighbors.push(this.convertCoords(tempPlus))
            neighbors.push(this.convertCoords(tempMinus))
        })
        return neighbors;
    }

   this.cubeSelectClickEvent = (e) => {
        mouse.x = ( e.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, this.camera );

        var intersects = raycaster.intersectObject( this.group, true );
        if ( intersects.length > 0 ) {
            let object = intersects[0].object;
            if (!this.epidemyStarted) {
                this.healAllCubes()
            }
            this.infectCube(object.name)
            const coords = this.convertCoords(object.name)
            this.inputs.posX.value = coords[0]
            this.inputs.posY.value = coords[1]
            this.inputs.posZ.value = coords[2]
        }
    }

    this.display = () => {
        this.renderer.domElement.addEventListener( 'dblclick', this.cubeSelectClickEvent );
        this.updateColors()
        this.setPositionInputs()
        this.camera.position.z = this.size * 1.5
        this.addLight()
        this.initCube()
        this.animate()
        this.renderAxes()
    }

    this.updateSize = (size) => {
        this.epidemyStarted = false
        this.infectedCubes = []
        this.controls.reset()
        this.size = size
        this.setPositionInputs()
        this.camera.position.z = this.size * 1.5
        this.clearCube()
        this.initCube()
        this.renderAxes()
        this.addLight()
    }
}

export default Cube
