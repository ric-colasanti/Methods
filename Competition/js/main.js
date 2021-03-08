function rndInt(maxVal){
    return Math.floor(Math.random() * maxVal);
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

class Node{
    constructor(home,parent) {
        this.home = home;
        this.parent = parent;
        this.offspring=[];
        this._resource = [0,0];
        this.home.occupant = this;
    }
    addResource(value){
        this._resource[Cell.tNow]+=value;
    }

    growth(){
        let newNode = null;
        if(this.offspring.length<2) {
            if (this._resource[Cell.tNext] > 1.0) {
                let newHome = this.home.optimumCell()
                if (newHome != null) {
                    this._resource[Cell.tNext]=this._resource[Cell.tNext]-1.0;
                    newNode = new Node(newHome,this);
                    this.offspring.push(newNode)
                }
            }
        }
        return newNode;
    }

    diffuse(){

        let count = 0
        if(this.parent!=null){
            count =1
        }
        let def = this._resource[Cell.tNow]/(this.offspring.length+count+1);
        this._resource[Cell.tNow] = 0.0;
        if(count===1){
            this.parent._resource[Cell.tNext]+=def;
        }
        for(let i=0;i<this.offspring.length;i++){
            this.offspring[i]._resource[Cell.tNext]+=def;
        }
        this._resource[Cell.tNext]+=def;
    }
}

class Cell {
    static tNow = 0;
    static tNext = 1;

    static update(){
        Cell.tNow=(Cell.tNow+1)%2;
        Cell.tNext=(Cell.tNext+1)%2;
    }

    constructor(xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.neighbors = []
        this._resource = [0,0]
        this.occupant = null;
    }
    resource(){
        return this._resource[Cell.tNow];
    }
    getResource(){
        return this._resource[Cell.tNext];
    }
    getAllResource(){
        if(this.occupant===null){
            return this._resource[Cell.tNow];
        }
        return this._resource[Cell.tNow]+this.occupant._resource[Cell.tNow]+1;
    }
    setResource(value){
        this._resource[Cell.tNow]=value;
    }
    addNeighbour(cell){
        this.neighbors.push(cell);
    }
    addOccupant(occupant){
        this.occupant = occupant;
    }
    removeOccupant(){
        this.occupant = null;
    }
    diffuse(){
        let oc = 0
        if (this.occupant!=null){
            oc=1
        }
        let def = this._resource[Cell.tNow]/(this.neighbors.length+oc);
        this._resource[Cell.tNow] = 0.0
        for(let i =0; i<this.neighbors.length;i++){
            this.neighbors[i]._resource[Cell.tNext]+=def;
        }
        if(oc===1){
            this.occupant._resource[Cell.tNow]+=def;
        }
    }
    optimumCell(){
        let s = rndInt(this.neighbors.length)
        let rMax = 0.1
        let pos = null
        for (let i=0;i<this.neighbors.length;i++){
            let cell = this.neighbors[(i+s)%this.neighbors.length]
            if(cell.occupant===null){
                if(cell.getResource()>rMax){
                    rMax = cell.getResource();
                    pos = cell;
                }
            }
        }
        return pos;
    }
}

class Grid{
    constructor(size) {
        this.size = size;
        let sz = size**2;
        this.cells = [];
        this.nodes = [];
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
                    cell.addNeighbour(this.cells[pos])
                }
            }
        }
        this.cells[this.pos(32,32)].setResource(300)
        let pos = 0
        for(let i=0; i<10;i++){
            pos = rndInt(this.cells.length)
            let node = new Node(this.cells[pos],null);
            this.nodes.push(node);
        }
    }

    pos(xPos,yPos){
        return (yPos*this.size)+xPos;
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
    getAllResource(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].getAllResource();
    }

    occupant(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].occupant!=null;
    }

    iterate(){
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].diffuse();
        }
        for (let i=0; i<this.nodes.length;i++){
            this.nodes[i].diffuse();
        }
        let l = this.nodes.length;
        for (let i=0; i<l;i++){
           let newNode = this.nodes[i].growth()
           if(newNode!=null){
               this.nodes.push(newNode);
           }
       }
        Cell.update();
    }
    printNodes(){
        let l = this.nodes.length;
        for (let i=0; i<l;i++){
            console.log(this.nodes[i].home.xPos,this.nodes[i].home.yPos);
        }
    }


}