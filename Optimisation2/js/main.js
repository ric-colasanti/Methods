class Dispaly {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");

        this.bufferCanvas = document.createElement("canvas");
        this.bufferCtx = this.bufferCanvas.getContext("2d");
        this.bufferCanvas.width = this.canvas.width;
        this.bufferCanvas.height = this.canvas.height;
        console.log(this.bufferCanvas.width);
    }

    update() {
        this.ctx.drawImage(this.bufferCanvas, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height, 0, 0, this.canvas.width, this.canvas.height);
        
        //this.ctx.clearRect(0,0,this.bufferCanvas.width, this.bufferCanvas.height)
    }
    clear(){
        this.bufferCtx.fillStyle = "#ffffff";
        this.bufferCtx.fillRect(0,0,this.bufferCanvas.width,this.bufferCanvas.height);
    }
}

class Particle {
    static size = 5
    static ctx = null
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
    }

    draw() {
        if (Particle.ctx != null) {
            Particle.ctx.beginPath();
            Particle.ctx.arc(this.x + Particle.size, this.y + Particle.size, Particle.size, 0, 2 * Math.PI);
            Particle.ctx.fillStyle = this.color;
            Particle.ctx.fill();
            Particle.ctx.stroke();
        }
    }
    update() {
        this.x += 12 * (Math.random() - 0.5)
        this.y += 12 * (Math.random() - 0.5)
        this.draw()
    }
    euclidean(particle){
        return Math.sqrt((this.x-particle.x)**2 + (this.y-particle.y)**2)
    }
    knn(array,k,fun){
        nerestNeighbours = []
        array.forEach(p =>{
            if(p!=this){
                nerestNeighbours.push({"part":p,"val":this.euclidean(p)})
            }
        });
    }

}



class Experiment {
    constructor(id, numParticles = 1, max = 100, min = 100) {
        this.interval = 0
        this.display = new Dispaly(id)
        this.iterations = 0;
        Particle.ctx = this.display.bufferCtx
        this.particles = []
        for (let i = 0; i < numParticles; i++) {
            this.particles.push(new Particle(Math.floor(Math.random() * this.display.canvas.width), Math.floor(Math.random() * this.display.canvas.height), "red"))
        }
    }
    update() {
        let len = this.particles.length
        this.display.clear()
        for (let i = 0; i < len; i++) {
            this.particles[i].update()
        }
       
        this.display.update()
        return this.iterations++;
    }
}