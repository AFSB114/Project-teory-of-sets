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
        this.jumpForce = 7.5
        this.isJumping = false
        this.friction = 0.8 // Coeficiente de fricción en el eje X
        this.airFriction = 1 // Coeficiente de fricción en el aire en el eje X
        this.acceleration = 1.5 // Aceleración en el eje X
        this.maxSpeed = 10 // Velocidad máxima en eje X
        
        // Animación
        this.frame = 0
        this.numsFrame = 4
        this.widthFrame = this.width
        this.animationSpeed = 10
        this.animationCounter = 0
        
        // Límites
        this.limitLeft = this.width / 3.4
        this.limitRight = 0
        this.limitBottom = 0
    }

    updatePhysics() {
        // Aplicar gravedad
        this.velocityY -= this.gravity
        
        // Actualizar posición Y
        this.posY += this.velocityY
        
        // Colisión con el suelo
        if (this.posY < this.limitBottom) {
            this.posY = this.limitBottom
            this.velocityY = 0
            this.isJumping = false
        }

        // Aplicar fricción X
        const frictionToUse = this.isJumping ? this.airFriction : this.friction
        this.velocityX *= frictionToUse

        // Limitar velocidad X
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

        // Actualizar posición X
        this.posX += this.velocityX
        this.posX = Math.max(this.limitLeft, Math.min(this.limitRight, this.posX))
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce
            this.isJumping = true
            // this.velocityX *= 1.2
        }
    }

    animate() {
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
        this.element.style.bottom = `${this.posY}px`
    }
}