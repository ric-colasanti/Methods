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

class Cell {
    static tNow = 0;
    static tNext = 1;

    static update(){
        console.log(Cell.tNow,Cell.tNext)
        Cell.tNow=(Cell.tNow+1)%2
        Cell.tNext=(Cell.tNext+1)%2
        console.log(Cell.tNow,Cell.tNext)

    }


    constructor(xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.neighbors = []
        this._resource = [0,0]
    }
    resource(){
        return this._resource[Cell.tNow];
    }
    setResource(value){
        this._resource[Cell.tNow]=value;
    }
    addNeighbour(cell){
        this.neighbors.push(cell);
    }
    diffuse(){
       // console.log(this.xPos,this.yPos,this.neighbors)
        let def = this._resource[Cell.tNow]/this.neighbors.length;
        this._resource[Cell.tNow] = 0.0
        for(let i =0; i<this.neighbors.length;i++){
            console.log(this.neighbors[i].xPos,this.neighbors[i].yPos);
            this.neighbors[i]._resource[Cell.tNext]=1.0;
        }
        console.log()
    }
}

class Grid{
    constructor(size) {
        this.size = size;
        let sz = size**2;
        this.cells = [];
        // Create cells
        for(let x=0; x<this.size;x++){
            for(let y=0;y<this.size;y++){
                let cell = new Cell(x,y);
                cell.setResource(Math.random());
                this.cells.push(cell)
            }
        }
        // add neighbours
        for(let i = 0; i<sz; i++){
            let cell = this.cells[i];
            let x = cell.xPos;
            let y = cell.yPos;
            for(let yy= y-1;yy<=y+1;yy++ ) {
                for (let xx = x-1; xx <= x+1; xx++) {
                    let pos = this.pos(this.bounds(yy),this.bounds(xx));
                    //console.log(x,y,xx,yy," ",this.bounds(xx),this.bounds(yy)," ",pos," ",this.cells[pos].xPos,this.cells[pos].yPos)
                    cell.addNeighbour(this.cells[pos])
                }
            }
            //console.log()
        }
    }
    pos(xPos,yPos){
        return yPos*this.size+xPos;
    }
    bounds(v){
        if(v<0){
            return this.size-1;
        }
        if(v>=this.size){
            return 0;
        }
        return v;
    }
    resource(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].resource();
    }
    iterate(){
        for (let i = 0; i < this.size; i++) {
            this.cells[i].diffuse()
        }
        console.log()
        Cell.update();
    }
}