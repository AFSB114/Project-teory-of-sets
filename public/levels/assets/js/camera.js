export default class Camera {
    constructor(scenariosContainer) {
        this.container = scenariosContainer
        this.position = 0
        this.limitLeft = 0
        this.limitRight = 0
        this.scenarioWidth = 0
    }

    follow(character) {
        if (character.posX > this.limitRight) {
            this.position = this.limitRight - this.limitLeft
        } else {
            this.position = character.posX - this.limitLeft
        }
        
        this.container.style.transform = `translateX(-${this.position}px)`
    }

    setToScenario(scenarioIndex) {
        this.position = this.scenarioWidth * scenarioIndex
        this.container.style.transform = `translateX(-${this.position}px)`
    }
}