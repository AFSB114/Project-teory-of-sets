class getLevel {

    constructor() {
        this.headLevel = null
        this.bodyLevel = null
    }

    async getLevel(numLevel) {
        const res = await fetch(`../../Level${numLevel}/index.html`)
            .then(res => res.text())

        const parser = new DOMParser()
        const doc = parser.parseFromString(res, 'text/html')

        this.bodyLevel = doc.body.innerHTML
        this.headLevel = doc.head.innerHTML
    }

    updateStyles() {
        const links = this.headLevel.getElementsByTagName('link')

        for (let link of links) {
            if (link.rel === 'stylesheet') {
                const style = document.createElement('style')
                style.innerHTML = link.href
                document.head.appendChild(style)
            }
        }
    }

}