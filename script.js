const character = document.getElementById('character')
const speed = 5

let scenarios, numScenarios
let height, width, limitLeft, limitRight
let posX, posY
let index1 = 0
let index2 = 1
let camera = 0
let intervalMove = null
let intervalAnimation = null
let frame = 0
const numsFrame = 4
const widthFrame = 166.25
let keysPress = {}
const directionsKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS']

function initialize() {
    const rect = scenario1.getBoundingClientRect()
    height = rect.height
    width = rect.width
    posX = character.getBoundingClientRect().x - (window.innerWidth * 0.1)
    posY = character.getBoundingClientRect().y
    scenarios = document.getElementsByClassName('scenario')
    limitLeft = width / 2 - 50
    numScenarios = scenarios.length
    limitRight = width * ((1 + (numScenarios - 1) * 2)) / 2 - 50
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

    posX = Math.max(0, Math.min(width * numScenarios - 100, posX))
    posY = Math.max(0, Math.min(height - 100, posY))

    if (posX >= limitLeft && posX <= limitRight) {
        camera = posX - limitLeft
    } else if (posX <= limitLeft) {
        camera = 0
    } else if (posX >= limitRight) {
        camera = limitRight - limitLeft
    }

    character.style.left = `${posX - camera}px`
    character.style.top = `${posY}px`

    scenarios[index1].style.left = `-${camera}px`
    scenarios[index2].style.left = `${width - camera}px`
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
        intervalMove = setInterval(move, 1000 / 120)
        intervalAnimation = setInterval(animation, 1000 / 12) // Intervalo fijo para la animación
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

// Inicializar los valores al cargar
initialize()