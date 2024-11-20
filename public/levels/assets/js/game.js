import Character from './character.js'
import Camera from './camera.js'

export default class Game {
    constructor(initialScenario = 0) {
        this.character = new Character(document.getElementById('character'))
        this.camera = new Camera(document.getElementById('scenarios'))
        this.scenarios = document.getElementsByClassName('scenario')
        this.currentScenario = initialScenario
        this.keysPress = {}
        this.animationFrameId = null
        this.directionsKeys = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD']

        this.initialize()
        this.setupEventListeners()
    }

    initialize() {
        const rect = this.scenarios[0].getBoundingClientRect()
        const height = rect.height
        const width = rect.width
        const numScenarios = this.scenarios.length

        if (this.currentScenario >= numScenarios) {
            console.warn(`El escenario ${this.currentScenario} no existe. Estableciendo escenario 0 como inicial.`)
            this.currentScenario = 0
        }

        this.character.limitBottom = this.character.height / 2.25
        this.character.limitRight = width * numScenarios - this.character.width - this.character.width / 3.4

        this.camera.scenarioWidth = width
        this.camera.limitLeft = width / 2 - this.character.width / 2
        this.camera.limitRight = width * numScenarios - width / 2 - this.character.width / 2

        this.setCharacterToScenario(this.currentScenario)
    }

    setupEventListeners() {
        // Manejador de teclas para movimiento
        document.addEventListener('keydown', (key) => {
            if (this.directionsKeys.includes(key.code)) {
                this.keysPress[key.code] = true
                this.start()
            }

            if (key.code === 'Space') {
                this.character.jump()
                this.start()
            }
        });

        document.addEventListener('keyup', (key) => {
            if (this.directionsKeys.includes(key.code)) {
                this.keysPress[key.code] = false

                // Solo detenemos la animación si no hay teclas de movimiento presionadas
                // y el personaje no está saltando
                if (!this.directionsKeys.some(keyPress => this.keysPress[keyPress]) && !this.character.isJumping) {
                    this.stop()
                }
            }
        });
    }

    setCharacterToScenario(scenarioIndex) {
        if (scenarioIndex >= this.scenarios.length || scenarioIndex < 0) {
            console.error('Índice de escenario inválido')
            return
        }

        const scenarioWidth = this.camera.scenarioWidth
        console.log(scenarioIndex)
        this.character.posX = scenarioWidth * (1 + (scenarioIndex * 2)) / 2 - this.character.width / 2
        this.character.posY = this.character.limitBottom

        this.character.updatePosition()
        this.camera.setToScenario(scenarioIndex)
        this.currentScenario = scenarioIndex
    }

    changeScenario(newScenarioIndex) {
        if (this.animationFrameId) {
            this.stop()
        }
        this.setCharacterToScenario(newScenarioIndex)
    }

    update() {
        this.character.updatePhysics()
        this.character.move(this.keysPress)
        this.character.animate()
        this.character.updatePosition()
        this.camera.follow(this.character)
    }

    loop = () => {
        this.update()
        this.animationFrameId = requestAnimationFrame(this.loop)
    }

    start() {
        if (!this.animationFrameId) {
            this.loop()
        }
    }

    stop() {
        if (this.animationFrameId) {
            // Solo detenemos la animación si el personaje no está saltando
            if (!this.character.isJumping) {
                cancelAnimationFrame(this.animationFrameId)
                this.animationFrameId = null
                this.character.element.style.backgroundPosition = '0 0'
            }
        }
    }
}