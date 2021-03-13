class FunctionalType{
    constructor( grow,tissue,seed,color) {
        this.grow = grow;
        this.tissue = tissue;
        this.seed = seed;
        this.count = 0;
        this.color = color
    }
}



class Cell {
    static tNow = 0;
    static tNext = 1;
    /**
     * As the CA is synchronous c(t+1) = f(t)
     * That relates to the two member array occupants
     * this.occupant = [null,null];
     * each element is alternately tNow and tNext.
     */
    static update(){
        Cell.tNow=(Cell.tNow+1)%2;
        Cell.tNext=(Cell.tNext+1)%2;
    }

    constructor(xPos,yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.resource = 0.0;
        this.disturbance = 0.0;
        this.occupant = [null,null];
        this.neighbors=[];
    }

    /**
     * Sets all cell occupancy to null. No plants in cell
     */
    die(){
        this.occupant[0]=null;
        this.occupant[1]=null;
    }
    /**
     * Returns the cell resource value plus any added environmental flex.
     * Always returns a value within the bounds 0.0 and 1.0
     * @param  {number} flex An environmental addition(+/-) to the cells resource.
     * @return {number}
     */
    getResource(flex){
        let n = this.resource + flex;
        if(n<0){
            return n;
        }
        if(n>1.0){
            return 1.0;
        }
        return n;
    }

    setResource(resource){
        if(resource<0){
            this.resource = 0
        }
        if(resource>1.0){
            this.resource = 1.0
        }
        this.resource = resource;
    }

    setDisturbance(disturbance){
        if(disturbance<0){
            this.disturbance = 0
        }
        if(disturbance>1.0){
            this.disturbance = 1.0
        }
        this.disturbance = disturbance;
    }


    /**
     * Returns the cell disturbance value plus any added environmental flex.
     * Always returns a value within the bounds 0.0 and 1.0
     * @param  {number} flex An environmental addition(+/-) to the cells disturbance.
     */
    getDisturbance(flex){
        let n = this.disturbance + flex;
        if(n<0){
            return n;
        }
        if(n>1.0){
            return 1.0;
        }
        return n;
    }

    /**
     * Adds another cell to the moore's neighbourhood of the cell.
     * @cell  {Cell} cell A cell class.
     */
    addNeighbour(cell){
        this.neighbors.push(cell);
    }

    /**
     * Returns the functional type current cell as defined by the time counter Cell.tNow.
     * @return {FunctionalType}
     */
    getOccupant(){
        return this.occupant[Cell.tNow]
    }

    /**
     * Returns true if cell is occupied in current iteration.
     * @return {boolean}
     */
    occupied(){
        return this.occupant[Cell.tNow]!=null;
    }
    /**
     * Adds a functional type.
     * @occupant  {FunctionalType}  A FunctionalType.
     */
    addOccupant(occupant){
        this.occupant[0]=occupant;
        this.occupant[1]=occupant;
    }

    getColor(){
        if(this.occupant[Cell.tNow] ===null){
            return "rgb(" + 0 + "," + 0 + "," + 0 + ")"
        }
        let r = this.occupant[Cell.tNow].color[0];
        let g = this.occupant[Cell.tNow].color[1];
        let b = this.occupant[Cell.tNow].color[2];
        return "rgb(" + r + "," + g + "," + b + ")"
    }

    /**
     * Counts Functionsl types in the CA
     */
    count(){
        if(this.occupant[Cell.tNow]==null){
            return null;
        }
        this.occupant[Cell.tNow].count+=1;
    }
    /**
     * Test to see if the a plant in the cell will maintain in the cell to the next round, growth
     * This is dependant on the cells resource and disturbance and on additional (+/-) environmental resource and disturbance
     * @param  {number} rFlex An environmental addition(+/-) to the cells resource.
     * @param  {number} dFlex An environmental addition(+/-) to the cells disturbance.
     * @return {number} 0 if no plant 1 if plant.
     */
    maintain(rFlex,dFlex){
        //if cell empty now it will empty next iteration
        if(this.getOccupant()===null){
            this.die()
            return 0;
        }
        // If cell undergoes a disturbance event the cell will have palnt type removed now and in the next iteration
        if(rndLt(this.getDisturbance(dFlex))){
            this.die()
            return 0;
        }
        // A plant is removed if  there is insufficient resource and the plant type has low tissue "durability"
        if((rndGt(this.getResource(rFlex))) && (rndGt(this.getOccupant().tissue))){
            this.die()
            return 0;
        }
        // If the plat survives all of its travails then it will be in the next round, growth.
        this.occupant[Cell.tNext]=this.occupant[Cell.tNow];
        return 1.0;
    }

    /**
     * The growth function
     * @param rFlex
     * @param dFlex
     * @param seedRain
     * @param plantTypes
     */
    growth(rFlex,dFlex,seedRain, plantTypes){
        // There has to be sufficient resource in the cell for plant growth
        if(rndLt(this.getResource(rFlex))){

            //test for vegetative growth
            for(let i of rndShuffle9(3)){
                if((this.neighbors[i].occupied())&&(rndLt(this.neighbors[i].getOccupant().grow))){
                    this.occupant[Cell.tNext] = this.neighbors[i].getOccupant();
                    return;
                }
            }

            // test for seed growth
            if (this.occupant[Cell.tNext]===null){
                for(let i of rndShuffle9(8)){
                    if((this.neighbors[i].occupied())&&(rndLt(this.neighbors[i].getOccupant().seed))){
                        this.occupant[Cell.tNext] = this.neighbors[i].getOccupant();
                        return;
                    }
                }
            }

            // test for growth from seed rain
            if (this.occupant[Cell.tNext]===null){
                if(rndLt(seedRain)){
                    this.occupant[Cell.tNext]=plantTypes[rndInt(plantTypes.length)];
                }
            }

        }
    }
}

class Experiment {
    constructor(size, plantTypes,colors) {
        this.cells = []
        this.size =size;
        this.plantTypes = [];
        for(let i=0;i<plantTypes[0].length;i++){
            let c = plantTypes[0][i]
            let s = plantTypes[1][i]
            let r = plantTypes[2][i]
            this.plantTypes.push(new FunctionalType(c,s,r,colors[i]))
        }
    }

    getXYPos(pos){
        return {y:Math.floor(pos/this.size),x:(pos%this.size)};
    }

    getPos(x,y){
        return y*this.size+x;
    }

    bounds(i){
        if(i<0){
            return this.size+i;
        }
        if(i>=this.size){
            return i-this.size;
        }
        return i;
    }

    setup(resource, disturbance,seedrain){
        // clear cells for new experiment
        this.cells = [];
        this.seedrain = seedrain;
        let t = this.size**2;
        for(let p=0; p<t;p++){
            let xyPos = this.getXYPos(p);
            this.cells.push(new Cell(xyPos.x,xyPos.y))
        }
        for(let p=0; p<this.cells.length;p++){
            let cell = this.cells[p];
            let type = rndArray(this.plantTypes);
            cell.addOccupant(type)
            cell.setResource(resource);
            cell.setDisturbance(disturbance);
            for(let y = cell.yPos-1;y<=cell.yPos+1;y++){
                for(let x = cell.xPos-1;x<=cell.xPos+1;x++){
                    let neighbour = this.cells[this.getPos(this.bounds(x),this.bounds(y))]
                    cell.addNeighbour(neighbour);
                }
            }
        }
    }
    getColor(x,y){
        let pos = this.getPos(x,y);
        return this.cells[pos].getColor()
    }
    iterate(){
        let t = this.size**2;
        for(let p=0; p<t;p++) {
            let cell = this.cells[p];
            cell.maintain(0,0);
        }
        for(let p=0; p<t;p++) {
            let cell = this.cells[p];
            cell.growth(0,0,this.seedrain,this.plantTypes);
        }
        Cell.update();
    }

}