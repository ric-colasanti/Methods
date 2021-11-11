var d3ScaleFree = function () {
    function randInt(max) {
        return Math.floor(Math.random() * max);
    }
    const agents=[]
    for(let i =0; i<100;i++){
        agent = {}
        agent.name= String.fromCharCode(65 + i%26),
        agent.links=[]
        agents.push(agent)
    }

    const data = {
        max:30,
        scalefree: [0],
        nodes: [{
            id: 0,
            agent: agents[0],
            name: String.fromCharCode(65),
            linked: false,
            size: 10,
            xpos: randInt(30),
            ypos: randInt(30),
        }],
        links: [],
        environment:[]
    };
    for (let index = 1; index < agents.length; index++) {
        let choiceRnd = data.scalefree[randInt(data.scalefree.length)];
        let choice = data.nodes[choiceRnd];
        
        choice.linked = true;
        newNode = {}
        newNode.id = index
        newNode.agent = agents[index],
        newNode.size = Math.floor(Math.random() * 10) + 2,
        newNode.xpos = randInt(data.max),
        newNode.ypos = randInt(data.max),
        newNode.linked = false
        data.nodes.push(newNode);
        data.links.push({
            id: index,
            source: choice.id,
            target: index,
            strength: Math.floor(Math.random() * 3) + 1
        });
        data.scalefree.push(index);
        data.scalefree.push(choiceRnd);
    }
    let count = 0
    for(let x =0; x<data.max;x++){
        for(let y=0; y<data.max;y++){
            data.environment.push({"id":count,"xpos":x,"ypos":y,"color": Math.random()<0.5 ? "lightgreen":"lightyellow"})
            count++;
        }
    }
    

    let zoom = d3.zoom().on("zoom", handleZoom);
    let amin = 0

    function handleZoom(e) {
        d3.select("svg g").attr("transform", e.transform);
    }

    // set the dimensions and margins of the graph
    const margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 40
        },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    yscale = height/data.max
    xscale = width/data.max
    const svg = d3
        .select("#pane")
        .append("svg")
        .style("border-style", "solid")
        .style("border-width", "1px")
        .call(zoom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    function update(anim) {
        // append the svg object to the body of the page
        //document.getElementById("btnChange1").className = "btn btn-secondary";
        //document.getElementById("btnChange1").disabled = true;

        // Initialize the links
        const link = svg
            .selectAll("line")
            .data(data.links, (d) => d.id)
            .join(
                (enter) =>
                enter
                .append("line")
                .attr("class", function(d){
                    dn= d3.select(this)
                    agent = data.nodes[d.source].agent 
                    if ( agent != undefined){
                        agent.links.push(this);
                    };
                    agent = data.nodes[d.target].agent 
                    if ( agent != undefined){
                        agent.links.push(this);
                    };
                    return "link"}
                    )
                .style("stroke-width", function(d){
                    return d.strength
                })
                .on("mouseover", function(event,d){
                    console.log(d.source.agent,d.target.agent)
                }),
                (update) => update.style("stroke-width", (d) => d.strength),
                (exit) => exit.remove()
            );
        // Initialize the nodes
        const node = svg
            .selectAll("circle")
            .data(data.nodes, (d) => d.id)
            .join(
                (enter) =>
                enter
                .append("circle")
                .attr("r", 0)
                .attr("cy", 0)
                .attr("cx", 0)
                .attr("class", function (d) {
                    return d.linked ? "nodelinked" : "nodesingle";
                })
                .on("mouseover", function(event,d){
                    document.getElementById("data").innerHTML= "<p>"+d.id+"</p>"
                    d3.select(this).style("stroke","red")
                    for(let i =0; i<d.agent.links.length;i++){
                        d3.select(d.agent.links[i]).style("stroke","red")
                    } 
                })
                .on("mouseout",function(e,d){
                    document.getElementById("data").innerHTML= "<p></p>"
                    d3.select(this).style("stroke","#aaaaaa")
                    for(let i =0; i<d.agent.links.length;i++){
                        d3.select(d.agent.links[i]).style("stroke","#aaaaaa")
                    }
                }),
                (update) =>
                update
                .style("fill", function (d) {
                    return d.linked ? "nodelinked" : "nodesingle";
                })
                .raise(), // Make sure that node is on top
                (exit) => exit.remove()
            );

        // Let's list the force we wanna apply on the network
        const simulation = d3
            .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
            .force(
                "link",
                d3
                .forceLink() // This force provides links between nodes
                .id(function (d) {
                    return d.id;
                }) // This provide  the id of a node
                .links(data.links) // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-4)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked)
            .on("end", function () {
                draw()
                //document.getElementById("btnChange").disabled = false;
                //document.getElementById("btnChange").className = "btn btn-primary";
            });

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            for (let i = 0; i < 50; i++) {
                simulation.tick();
            }
        }

        function draw() {
            node
                .attr("r", (d) => d.size)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                })
        }
    }
    const env = svg
    .selectAll("rect")
    .data(data.environment, (d) => d.id)
    .join(
        (enter) =>
        enter
        .append("rect")
        .attr("x",d => d.xpos*xscale)
        .attr("y",d => d.ypos*yscale)
        .attr("width", xscale)
        .attr("height", yscale)
        .attr("fill",d=>d.color)
        .attr("visibility", "hidden")
        ,
        (update) =>
        update.attr("visibility", "hidden"),
        (exit) => exit.remove()
    );

    function update2(data) {
        const node = svg
            .selectAll("circle")
            .data(data.nodes, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) =>
                update
                .transition()
                .duration(1000)
                .attr("cx", function (d) {
                    return d.xpos*xscale;
                })
                .attr("cy", function (d) {
                    return d.ypos*yscale;
                })
                .style("fill", function (d) {
                    return d.linked ? "nodelinked" : "nodesingle";
                }),
                (exit) => exit.remove()
            );
        const link = svg
            .selectAll("line")
            .data(data.links, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) => update
                .style("stroke-width", (d) => d.strength)
                .transition()
                .duration(1000)
                .attr("x1", function (d) {
                    return d.source.xpos*xscale;
                })
                .attr("y1", function (d) {
                    return d.source.ypos*yscale;
                })
                .attr("x2", function (d) {
                    return d.target.xpos*xscale;
                })
                .attr("y2", function (d) {
                    return d.target.ypos*yscale;
                }),
                (exit) => exit.remove()
            );
            const env = svg
            .selectAll("rect")
            .data(data.environment, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) =>
                update
                .transition()
                .duration(1000)
                .attr("visibility", "visible"),
                (exit) => exit.remove()
            );
    }

    function update3(data) {
        const node = svg
            .selectAll("circle")
            .data(data.nodes, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) =>
                update
                .attr("r", (d) => d.size)
                .transition()
                .duration(1000)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                }),
                (exit) => exit.remove()
            );
        const link = svg
            .selectAll("line")
            .data(data.links, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) => update
                .style("stroke-width", (d) => d.strength)
                .transition()
                .duration(1000)
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                }),
                (exit) => exit.remove()
            );
            const env = svg
            .selectAll("rect")
            .data(data.environment, (d) => d.id)
            .join(
                (enter) =>
                enter,
                (update) =>
                update
                .transition()
                .duration(1000)
                .attr("visibility", "hidden"),
                (exit) => exit.remove()
            );
    }



    function addData() {
        let index = data.nodes.length + 1;
        let choiceRnd = data.scalefree[randInt(data.scalefree.length)];
        let choice = data.nodes[choiceRnd];
        choice.linked = true;
        data.nodes.push({
            id: index,
            name: String.fromCharCode(65 + index),
            size: Math.floor(Math.random() * 10) + 2
        });
        data.links.push({
            id: index,
            source: choice.id,
            target: index,
            strength: Math.floor(Math.random() * 3) + 1
        });
        data.scalefree.push(index);
        data.scalefree.push(choiceRnd);
    }
    document.getElementById("btnChange1").onclick = function () {
       // updateEnv(data)        
        update2(data);

    };
    document.getElementById("btnChange2").onclick = function () {
        update3(data);
    };
    update();
};