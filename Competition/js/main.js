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
            this.ctx.arc(x*this.cSize+offset,y*this.cSize+offset,offset-2,0, 2 * Math.PI)
            this.ctx.fillStyle = circleColor;
            this.ctx.fill();
        }
    }

    update(canvasID){
        let visible_canvas = document.getElementById(canvasID);
        let vctx = visible_canvas.getContext("2d");
        vctx.drawImage(this.buffer, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height, 0, 0, vctx.canvas.width, vctx.canvas.height); 
    }
}

