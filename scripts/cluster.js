let nodos;
let chart;
let sim;
const width = 1700;
const height = 1000;

const color = d3.scaleOrdinal()
    .domain(['gonza', 'nico', 'flori'])
    .range(['blue', 'green', 'red']);

const opacidad = d3.scaleLinear().range([.05, 1]);
const radio = d3.scaleRadial().range([8, 80]);
const strokeWidth = d3.scaleLinear().range([1, 10]); // added this line

let tooltip = d3.select("#visualization").append("div")
  .attr("class", "tooltiptest")
  .style("opacity", 0)

console.log(tooltip.node());

d3.csv('../data/data3.csv', d3.autoType).then(data => {
    nodos = data;
    opacidad.domain(d3.extent(nodos, d => d.energy));
    radio.domain(d3.extent(nodos, d => +d.danceability));
    strokeWidth.domain(d3.extent(nodos, d => +d.valence)); // added this line

    const svg = d3.select('#visualization').append('svg').attr('width', width).attr('height', height);
    chart = svg
        .append('g')
        .attr('transform', `translate(${[width / 2, height / 2]})`);

    createSimulation(nodos);
    draw(chart, nodos);

    // const legend = svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //     .attr("text-anchor", "end")
    //     .selectAll("g")
    //     .data(color.domain().slice().reverse())
    //     .join("g")
    //     .attr("transform", (d, i) => `translate(-50,${i * 20})`);

    // // Draw legend colored rectangles
    // legend.append("rect")
    //     .attr("x", width - 19)
    //     .attr("width", 19)
    //     .attr("height", 19)
    //     .attr("fill", color);

    // // Draw legend text
    // legend.append("text")
    //     .attr("x", width - 24)
    //     .attr("y", 9.5)
    //     .attr("dy", "0.32em")
    //     .text(d => d);

});

function buttonClick(user) {
    if (selectedUsers.has(user)) {
        // Trying to deselect the user
        if (selectedUsers.size === 1) {
            // Prevent deselecting if it's the last selected user
            return;
        }
        selectedUsers.delete(user);
        document.getElementById(user).style.backgroundColor = "gray";
    } else {
        // Selecting the user
        selectedUsers.add(user);
        document.getElementById(user).style.backgroundColor = "black";
    }

    let filtered = nodos.filter(d => selectedUsers.has(d.user));
    createSimulation(filtered);
    draw(chart, filtered);
}



let selectedUsers = new Set(['nico', 'gonza', 'flori']);

// function update(user) {
//     // If the user is already selected, remove it from the selection
//     // Otherwise, add it to the selection
//     if (selectedUsers.has(user)) {
//         selectedUsers.delete(user);
//     } else {
//         selectedUsers.add(user);
//     }

//     let filtered;
//     if (selectedUsers.size === 0) {
//         filtered = nodos;
//         // displayMessage('Click any name to see a cluster');
//     } else {
//         filtered = nodos.filter(d => selectedUsers.has(d.user));
//         // hideMessage();
//     }
//     createSimulation(filtered);
//     draw(chart, filtered);
    
// }



function createSimulation(nodos) {
    sim = d3.forceSimulation(nodos)
        .force('manybody', d3.forceManyBody().strength(400))
        .force('center', d3.forceCenter())
        .force('y', d3.forceY().strength(0.1))
        .force('x', d3.forceX().strength(0.01))
        // .force('collide', d3.forceCollide(d => radio(+d.danceability) + 1).strength(2).iterations(5))
        .force('collide', d3.forceCollide(d => radio(+d.danceability) +2).strength(1).iterations(5)) // added stroke width here
        .on('tick', redraw);
}

function draw(chart, nodos) {
    chart.selectAll('*').remove();

    const sessions = chart
        .selectAll('g.session')
        .data(nodos)
        .join('g')
        .attr('class', 'session')
        .attr('transform', d => `translate(${[d.x, d.y]})`);

    sessions
        .append('circle')
        .attr('r', d => radio(+d.danceability))
        .style('fill', (d, i) => color(d.user))
        .style('fill-opacity', d => opacidad(d.energy)/1.1)
        .style('stroke', d => color(d.user)) 
        .style('stroke-width', d => strokeWidth(d.valence) + 'px') // updated this line
        .on("mouseover", function(event, d) {
            d3.select(this).style('fill-opacity',  d => opacidad(d.energy)+0.4); // change opacity to full
            console.log(d);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html('<b>'+d.song+'</b>' + '<br/>' + '<br/>' + 'Danceability:' + d.danceability + '<br/>' + 'Energy:' + d.energy + '<br/>' + 'Valence:' + d.valence)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", function(event, d) {
            tooltip
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY) + "px")
        })        
        .on("mouseleave", function(d) {
            d3.select(this).style('fill-opacity', d => opacidad(d.energy)/1.1);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function redraw() {
    d3.selectAll('.session').attr('transform', d => `translate(${[d.x, d.y]})`);
}
