var d3ScaleFree = function () {
    function randInt(max) {
        return Math.floor(Math.random() * max);
    }

    const data = {
        scalefree: [0],
        nodes: [{
            id: 0,
            name: String.fromCharCode(65),
            linked: false,
            size: 10,
            xpos: randInt(300),
            ypos: randInt(300),
        }],
        links: []
    };
    for (let index = 1; index < 200; index++) {
        let choiceRnd = data.scalefree[randInt(data.scalefree.length)];
        let choice = data.nodes[choiceRnd];
        console.log(choice);
        choice.linked = true;
        data.nodes.push({
            id: index,
            name: String.fromCharCode(65 + index),
            size: Math.floor(Math.random() * 10) + 2,
            xpos: randInt(300),
            ypos: randInt(300),
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
    console.log(data);

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
        height = 600 - margin.top - margin.bottom;
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
                .attr("class", "link")
                .style("stroke-width", (d) => d.strength),
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

    function update2(data) {
        const node = svg
            .selectAll("circle")
            .data(data.nodes, (d) => d.id)
            .join(
                (enter) =>
                enter
                .append("circle")
                .attr("r", 0)
                .attr("r", (d) => d.size)
                .attr("cx", function (d) {
                    return d.xpos;
                })
                .attr("cy", function (d) {
                    return d.ypos;
                })
                .attr("class", function (d) {
                    return d.linked ? "nodelinked" : "nodesingle";
                }),
                (update) =>
                update
                .attr("r", (d) => d.size)
                .transition()
                .duration(1000)
                .attr("cx", function (d) {
                    return d.xpos;
                })
                .attr("cy", function (d) {
                    return d.ypos;
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
                enter
                .append("line")
                .attr("class", "link")
                .style("stroke-width", (d) => d.strength),
                (update) => update
                .style("stroke-width", (d) => d.strength)
                .transition()
                .duration(1000)
                .attr("x1", function (d) {
                    return d.source.xpos;
                })
                .attr("y1", function (d) {
                    return d.source.ypos;
                })
                .attr("x2", function (d) {
                    return d.target.xpos;
                })
                .attr("y2", function (d) {
                    return d.target.ypos;
                }),
                (exit) => exit.remove()
            );
    }

    function update3(data) {
        const node = svg
            .selectAll("circle")
            .data(data.nodes, (d) => d.id)
            .join(
                (enter) =>
                enter
                .append("circle")
                .attr("r", 0)
                .attr("r", (d) => d.size)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("class", function (d) {
                    return d.linked ? "nodelinked" : "nodesingle";
                }),
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
                enter
                .append("line")
                .attr("class", "link")
                .style("stroke-width", (d) => d.strength),
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
    }


    function addData() {
        let index = data.nodes.length + 1;
        let choiceRnd = data.scalefree[randInt(data.scalefree.length)];
        let choice = data.nodes[choiceRnd];
        console.log(choice);
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
        update2(data);
    };
    document.getElementById("btnChange2").onclick = function () {
        update3(data);
    };
    update();
};