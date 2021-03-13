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
    resource(){
        return this._resource[Cell.tNow];
    }
    growth(){
        let newNode = null;
        if(this.offspring.length<2) {
            if (this._resource[Cell.tNext] > 1.0) {
                let newHome = this.home.optimumCell(0.0)
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
    optimumCell(minimum){
        let s = rndInt(this.neighbors.length)
        let rMax = minimum
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
                cell.setResource(0);
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
                    if(this.boundsy(xx)) {
                        let pos = this.pos(this.boundsx(yy),xx);
                        cell.addNeighbour(this.cells[pos])
                    }
                }
            }
        }
        for(let x = 0;x<this.size;x++){
            this.cells[this.pos(x,2)].setResource(60)
        }
        // let node = new Node(this.cells[this.pos(10,62)],null);
        // this.nodes.push(node);
        let node = new Node(this.cells[this.pos(32,62)],null);
        this.nodes.push(node);
        // let node = new Node(this.cells[this.pos(32,62)],null);
        // this.nodes.push(node);
    }

    pos(xPos,yPos){
        return (yPos*this.size)+xPos;
    }

    boundsx(v){
        if(v<0){
            return this.size-1;
        }
        if(v>=this.size){
            return 0;
        }
        return v;
    }

    boundsy(v){
        if(v<0){
            return false;
        }
        if(v>=this.size){
            return false;
        }
        return true;
    }


    resource(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].resource();
    }
    getAllResource(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].getAllResource();
    }

    occupant(xPos,yPos){
        return this.cells[this.pos(xPos,yPos)].occupant;
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