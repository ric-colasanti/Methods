function SVG(elementName) {
    return document.createElementNS('http://www.w3.org/2000/svg', elementName);
}


class Charater {
    static SVG(elementName) {
        return document.createElementNS('http://www.w3.org/2000/svg', elementName);
    }
    constructor(discriptor) {
        this.descriptor = discriptor;
        this.svg = Charater.SVG('g')

        this.head = SVG("image")
        this.head.setAttribute('href', "img/" + this.descriptor.parts.head.neutral);
        this.head.setAttribute("height", "100%")
        this.svg.appendChild(this.head)

        this.eyes = SVG("image")
        this.eyes.setAttribute('href', "img/" + this.descriptor.parts.eyes.neutral);
        this.eyes.setAttribute("height", "100%")
        this.svg.appendChild(this.eyes)

        this.mouth = SVG("image")
        this.mouth.setAttribute('href', "img/" + this.descriptor.parts.mouth.neutral);
        this.mouth.setAttribute("height", "100%")
        this.svg.appendChild(this.mouth)

        this.torso = SVG("image")
        this.torso.setAttribute('href', "img/" + this.descriptor.parts.torso.neutral);
        this.torso.setAttribute("height", "100%")
        this.svg.appendChild(this.torso)
    }

    changeTorso(type) {
        this.torso.setAttribute('href', "img/" + this.descriptor.parts.torso[type]);
    }

    changeHead(type) {
        this.head.setAttribute('href', "img/" + this.descriptor.parts.head[type]);
    }

    changeMouth(type) {
        this.mouth.setAttribute('href', "img/" + this.descriptor.parts.mouth[type]);
    }

    changeEyes(type) {
        this.eyes.setAttribute('href', "img/" + this.descriptor.parts.eyes[type]);
    }

    add(frame, size, xpos) {
        this.frame = frame
        this.size = size
        this.xpos = xpos
        frame.appendChild(this.svg)
        this.height = frame.getAttribute("height")
        this.svg.setAttribute("transform", "translate(" + xpos + "," + (this.height - (this.height * this.size)) + ") scale(" + this.size + "," + this.size + ")");
    }

    move(xpos) {
        let height = this.frame.getAttribute("height")
        this.xpos = xpos
        this.svg.setAttribute("transform", "translate(" + xpos + "," + (this.height - (this.height * this.size)) + ") scale(" + this.size + "," + this.size + ")");

    }

    expression = function (expression) {
        //this.toString.push(expression)
        switch (expression) {
            case "happy":
                this.changeMouth("happy");
                break;
            case "eyesleft":
                this.changeEyes("left");
                break;
            case "eyesright":
                this.changeEyes("right");
                break;
            case "sad":
                this.changeMouth("sad");
                break;
            case "crossarms":
                this.changeTorso("armscrossed");
                break;
        }
    }
}

class SpeechBubble {

    constructor(text) {
        //console.log(text)
        this.xpos = 0;
        this.ypos = 0;
        this.next = null;
        this.text = text;
        //console.log("here 2.1");
        var words = text.split(" ")
        //console.log(words)
        var lines = []
        var l = 0
        var count = 0
        while (count < words.length) {
            var line = ""
            while ((line.length < 20) && (count < words.length)) {
                line = line + words[count] + " ";
                count++;
                //console.log(line);
            }
            lines[l] = line
            l++
        }
        this.group = SVG("g")
        var frame = SVG("rect")
        var height = 10
        frame.setAttribute("stroke", "black")
        frame.setAttribute("x", 0)
        frame.setAttribute("y", 0)
        frame.setAttribute("rx", 10)
        frame.setAttribute("ry", 10)
        frame.setAttribute("stroke-width", 1)
        frame.setAttribute("width", 200)
        frame.setAttribute("fill", "#ffff")
        this.group.appendChild(frame)
        var yPos = 20
        for (l in lines) {
            var speech = SVG("text")
            speech.setAttribute("font-family", "sans-serif")
            speech.setAttribute("font-size", "12px")
            speech.setAttribute("x", 10)
            speech.setAttribute("y", yPos)
            var textNode = document.createTextNode(lines[l]);
            speech.appendChild(textNode)
            yPos += 20
            this.group.appendChild(speech)
            height += 20
        }
        frame.setAttribute("height", height)

    }

    clear = function () {
        elm = this.group
        if (elm != null) {
            while (elm.firstChild) {
                elm.removeChild(elm.firstChild);
            }
        }
    }

}