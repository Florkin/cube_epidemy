import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Interaction} from 'three.interaction';

function Cube() {
    this.colors = {
        baseColor: new THREE.Color('#F0E7D8'),
        lineColor: new THREE.Color('#000000'),
        infectedColor: new THREE.Color('#61210F'),
        white: new THREE.Color('#ffffff'),
    }

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
    this.interaction = new Interaction(this.renderer, this.scene, this.camera);

    this.setHtmlInputs = (size, axes, x, y, z) => {
        this.sizeInput = size
        this.axesInput = axes
        this.xInput = x
        this.yInput = y
        this.zInput = z
    }

    this.setPositionInputs = () => {
        const offset = this.size % 2 === 0 ? 1 : 0
        const min = -Math.floor(this.size / 2) + offset
        const max = Math.floor(this.size / 2)
        this.xInput.value = 0
        this.yInput.value = 0
        this.zInput.value = 0
        this.xInput.setAttribute('min', min)
        this.xInput.setAttribute('max', max)
        this.yInput.setAttribute('min', min)
        this.yInput.setAttribute('max', max)
        this.zInput.setAttribute('min', min)
        this.zInput.setAttribute('max', max)
    }

    this.renderAxes = () => {
        if (this.axesInput.checked) {
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
            color: this.colors.baseColor,
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
        this.healthyCubes = this.cubes
        this.scene.add(cube)
        this.scene.add(line)
        cube.cursor = 'pointer';
        cube.on('click', function () {
            alert("ni")
        });
    }

    this.initCube = () => {
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

    this.reInitCubesColor = () => {
        const cube = this
        this.cubes.forEach((elem) => {
            cube.scene.getObjectByName(elem).material.color.set(cube.colors.baseColor)
        })
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

    this.display = () => {
        this.setPositionInputs()
        this.camera.position.z = this.size * 1.5
        this.addLight()
        this.initCube()
        this.animate()
        this.renderAxes()
    }

    this.updateSize = (size) => {
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
