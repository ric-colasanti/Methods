class CACanvas{
    constructor(size,cSize){
        this.size = size;
        this.cSize = cSize;
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.size*this.cSize;
        this.buffer.height = this.size*this.cSize;
        this.ctx = this.buffer.getContext("2d");
    }

    draw(x,y,cellColor){
        this.ctx.beginPath();
        this.ctx.rect(x*this.cSize,y*this.cSize,this.cSize,this.cSize)
        this.ctx.fillStyle = cellColor;
        this.ctx.fill();  
    }

    update(canvasID){
        var visible_canvas = document.getElementById(canvasID);
        var vctx = visible_canvas.getContext("2d");
        vctx.drawImage(this.buffer, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0, 0, vctx.canvas.width, vctx.canvas.height); 
    }
}