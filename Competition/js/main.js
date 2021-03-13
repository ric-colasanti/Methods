function rndInt(maxVal){
    return Math.floor(Math.random() * maxVal);
}

function rndLt(testVal){
    return Math.random() < testVal;
}

function rndGt(testVal){
    return Math.random() > testVal;
}

function rndShuffle9(num){
    let vals=[0,1,2,3,4,5,6,7,8]
    let result=[];
    for(let i=0; i<num;i++){
        result.push(vals.splice(rndInt(vals.length),1))
    }
    return result
}
function rndArray(anArray){
    return anArray[rndInt(anArray.length)]
}

function landscape(roughness) {
    levels = 7
    size = 2 ** (levels - 1)
    height = new Array(size + 1);


    for (var i = 0; i < height.length; i++) {
        height[i] = new Array(size + 1);
    }


    for (lev = 0; lev < levels; lev++) {
        step = Math.floor(size / 2 ** lev)

        for (y = 0; y < size + 1; y += step) {
            jumpover = 0
            if (lev > 0) {
                jumpover = 1 - Math.floor(y / step) % 2
            }
            start = step * jumpover
            stop = size + 1
            stepsize = step * (1 + jumpover)
            for (x = start; x < stop; x += stepsize) {
                pointer = 3
                if (lev > 0) {
                    pointer = 1 - Math.floor(x / step) % 2 + 2 * jumpover
                }
                yref = step * (1 - Math.floor(pointer / 2))
                xref = step * (1 - pointer % 2)
                corner1 = height[y - yref][x - xref]
                corner2 = height[y + yref][x + xref]
                average = (corner1 + corner2) / 2.0
                variation = (Math.pow(step, roughness)) * (Math.random() - 0.5)
                height[y][x] = 0
                if (lev > 0) {
                    height[y][x] = average + variation
                }
            }
        }
    }
    count = 0
    for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
            count += height[x][y]
        }
    }
    m = count / (size * size)
    for (y = 0; y < size; y++) {
        for (x = 0; x < size; x++) {
            if (height[x][y] < m) {
                height[x][y] = -1
            } else {
                height[x][y] = 1
            }
        }
    }
    return height
}

class CACanvas{
    constructor(size,cSize){
        this.size = size;
        this.cSize = cSize;
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.size*this.cSize;
        this.buffer.height = this.size*this.cSize;
        this.ctx = this.buffer.getContext("2d");
    }

    draw(x,y,cellColor,circle=false,circleColor="#000000"){
        this.ctx.beginPath();
        this.ctx.rect(x*this.cSize,y*this.cSize,this.cSize,this.cSize)
        this.ctx.fillStyle = cellColor;
        this.ctx.fill();
        if(circle===true){
            let offset = Math.floor(this.cSize/2);
            this.ctx.beginPath();
            this.ctx.arc(x*this.cSize+offset,y*this.cSize+offset,offset-1,0, 2 * Math.PI)
            this.ctx.fillStyle = circleColor;
            this.ctx.fill();
            this.ctx.strokeStyle = '#000000';
            this.ctx.stroke();

        }
    }

    update(canvasID){
        let visible_canvas = document.getElementById(canvasID);
        let vctx = visible_canvas.getContext("2d");
        vctx.drawImage(this.buffer, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0, 0, vctx.canvas.width, vctx.canvas.height); 
    }
}

