function keypress(e,element,output){
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that runs
        game.parse(element.value);
        element.value = ""
        let out = document.getElementById(output);
        out.scrollTop = out.scrollHeight;
    }
}
document.getElementById('output').value = '';
document.getElementById('command').focus();;


class Parser{
    constructor(nouns,verbs){
        this.nouns = nouns;
        this.verbs = verbs;
    }
    parse(input){
        input = input.replace(/[\n\r]+/g, '').trim();// remove cr
        let words = input.split(/\ +/) // regex with more than one space
        let lWords = words.map(w=>{return w.toLowerCase()})
        if(words.length!=2){
            return{msg:"must have two words",verb:"",noun:""};
        }
        let verb =  this.verbs.indexOf(lWords[0])
        let noun =  this.nouns.indexOf(lWords[1])
        if(verb ==-1){
            return{msg:lWords[0]+" not in verbs",verb:lWords[0],noun:lWords[1]};    
        }
        if(noun == -1){
            return{msg:lWords[1]+" not in nouns",verb:lWords[0],noun:lWords[1]};    
        }
        return{msg:"ok",verb:this.verbs[verb],noun:this.nouns[noun]};
    }
}


class Game{
    constructor(){
        let nouns = ["box","folder","north","south","east","west"]
        let verbs = ["go","move","take","drop"]
        this.parser = new Parser(nouns,verbs)
    }
    parse(words){
        let result = this.parser.parse(words);
        let out = document.getElementById('output');
        if(result.msg=="ok"){    
            out.value +=  result.verb+ " "+ result.noun+"\n";
        }else{
            out.value += result.msg + "\n";
        }
    }
}

var game = new Game();