const character = document.getElementById('character')
const speed = 8

let scenarios, numScenarios
let height, width, limitLeft, limitRight
let posX, posY
let camera = 0
let intervalMove = null
let intervalAnimation = null
let frame = 0
const numsFrame = 3
const widthFrame = 180
let keysPress = {}
const directionsKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS']

function initialize() {
    scenarios = document.getElementsByClassName('scenario')
    const rect = scenarios[0].getBoundingClientRect()
    height = rect.height
    width = rect.width
    posX = character.getBoundingClientRect().x - (window.innerWidth * 0.1)
    posY = character.getBoundingClientRect().y
    numScenarios = scenarios.length
    limitLeft = width / 2 - character.clientWidth / 2
    limitRight = width * numScenarios - width / 2 - character.clientWidth / 2
}

function move() {
    if (keysPress['ArrowLeft'] || keysPress['KeyA']) {
        posX -= speed
    } else if (keysPress['ArrowRight'] || keysPress['KeyD']) {
        posX += speed
    }
    if (keysPress['ArrowUp'] || keysPress['KeyW']) {
        posY -= speed
    } else if (keysPress['ArrowDown'] || keysPress['KeyS']) {
        posY += speed
    }

    posX = Math.max(0, Math.min(width * numScenarios - character.clientWidth, posX))
    posY = Math.max(0, Math.min(height - character.clientWidth * 2, posY))

    if (posX >= limitLeft && posX <= limitRight) {
        camera = posX - limitLeft
    } else if (posX <= limitLeft) {
        camera = 0
    } else if (posX >= limitRight) {
        camera = limitRight - limitLeft
    }

    character.style.left = `${posX - camera}px`
    character.style.top = `${posY}px`

    for (let i = 0; i < numScenarios; i++) {
        scenarios[i].style.left = `${width * i - camera}px`
    }
}

function animation() {
    if (keysPress['KeyA'] || keysPress['ArrowLeft']) {
        character.style.transform = 'scaleX(-1)'
    } else if (keysPress['KeyD'] || keysPress['ArrowRight']) {
        character.style.transform = 'scaleX(1)'
    }

    character.style.backgroundPosition = `-${frame * widthFrame}px 0`
    frame = (frame + 1) % numsFrame
}

function start() {
    if (intervalMove === null) {
        intervalMove = setInterval(move, 1000 / 60)
        intervalAnimation = setInterval(animation, 100)
    }
}

function stop() {
    if (intervalMove !== null && intervalAnimation !== null) {
        clearInterval(intervalMove)
        clearInterval(intervalAnimation)
        intervalMove = null
        intervalAnimation = null
        character.style.backgroundPosition = '0 0'
    }
}

document.addEventListener('keydown', (key) => {
    if (directionsKeys.includes(key.code)) {
        keysPress[key.code] = true
        start()
    }
})

document.addEventListener('keyup', (key) => {
    if (directionsKeys.includes(key.code)) {
        keysPress[key.code] = false
        if (!directionsKeys.some(keyPress => keysPress[keyPress])) {
            stop()
        }
    }
})

initialize()