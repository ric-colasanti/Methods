let testbar= function(){

    function boxMullerTransform() {
        const u1 = Math.random();
        const u2 = Math.random();
        
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        
        return { z0, z1 };
    }
    
    function getNormallyDistributedRandomNumber(mean, stddev) {
        const { z0, _ } = boxMullerTransform();
        
        return z0 * stddev + mean;
    }
    let data = []
    for(let i=0 ; i <10; i++){
        data .push({"Label":i.toString(),"Value":0})
    }

    for(let i=0; i<1000;i++){
        let d=  Math.floor(getNormallyDistributedRandomNumber(5,1))
        if((d>=0)&&(d<10)){
            
            data[d.toString()].Value++;
        }
    }
    console.log(data);
    // let data = [
    // {"Label":"United States","Value":12394},
    // {"Label":"Russia","Value":6148},
    // {"Label":"Germany (FRG)","Value":1653},
    // {"Label":"France","Value":2162},
    // {"Label":"United Kingdom","Value":1214},
    // {"Label":"China","Value":1131},
    // {"Label":"Spain","Value":814},
    // {"Label":"Netherlands","Value":1167},
    // {"Label":"Italy","Value":660},
    // {"Label":"Israel","Value":1263},
    // ]
    bar(data,"#barchart",500, "Weight","Count","orange")
}