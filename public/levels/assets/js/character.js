export default class Character {
    constructor(element) {
        this.element = element
        this.width = element.clientWidth
        this.height = element.clientHeight
        
        // Posición y movimiento
        this.posX = 0
        this.posY = 0
        this.velocityX = 0
        this.velocityY = 0
        this.speed = 10
        
        // Física mejorada
        this.gravity = 0.5
        this.jumpForce = -10
        this.isJumping = false
        this.friction = 0.85 // Fricción para el movimiento horizontal
        this.airFriction = 0.95 // Fricción diferente en el aire
        this.acceleration = 1.5 // Aceleración al moverse
        this.maxSpeed = 10 // Velocidad máxima horizontal
        
        // Animación
        this.frame = 0
        this.numsFrame = 4
        this.widthFrame = this.width
        this.animationSpeed = 9
        this.animationCounter = 0
        
        // Límites
        this.limitLeft = this.width / 3.4
        this.limitRight = 0
        this.limitBottom = 0
    }

    updatePhysics() {
        // Aplicar gravedad
        this.velocityY += this.gravity
        
        // Actualizar posición vertical
        this.posY += this.velocityY
        
        // Colisión con el suelo
        if (this.posY > this.limitBottom) {
            this.posY = this.limitBottom
            this.velocityY = 0
            this.isJumping = false
        }

        // Aplicar fricción horizontal
        const frictionToUse = this.isJumping ? this.airFriction : this.friction
        this.velocityX *= frictionToUse

        // Limitar velocidad horizontal
        if (Math.abs(this.velocityX) < 0.1) {
            this.velocityX = 0
        }
    }

    move(keysPress) {
        // Movimiento horizontal con aceleración
        if (keysPress['ArrowLeft'] || keysPress['KeyA']) {
            this.velocityX = Math.max(this.velocityX - this.acceleration, -this.maxSpeed)
            this.element.style.transform = 'scaleX(-1)'
        }
        if (keysPress['ArrowRight'] || keysPress['KeyD']) {
            this.velocityX = Math.min(this.velocityX + this.acceleration, this.maxSpeed)
            this.element.style.transform = 'scaleX(1)'
        }

        // Actualizar posición horizontal
        this.posX += this.velocityX
        this.posX = Math.max(this.limitLeft, Math.min(this.limitRight, this.posX))
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce
            this.isJumping = true
            // Mantener la velocidad horizontal al saltar
            this.velocityX *= 1.2 // Opcional: dar un pequeño impulso al saltar
        }
    }

    animate() {
        // Animar solo si hay movimiento significativo
        if (Math.abs(this.velocityX) > 0.5) {
            this.animationCounter++
            if (this.animationCounter >= this.animationSpeed) {
                this.element.style.backgroundPosition = `-${this.frame * this.widthFrame}px 0`
                this.frame = (this.frame + 1) % this.numsFrame
                this.animationCounter = 0
            }
        } else {
            // Volver a la pose inicial cuando no hay movimiento
            this.element.style.backgroundPosition = '0 0'
            this.frame = 0
        }
    }

    updatePosition() {
        this.element.style.left = `${this.posX}px`
        this.element.style.top = `${this.posY}px`
    }
}