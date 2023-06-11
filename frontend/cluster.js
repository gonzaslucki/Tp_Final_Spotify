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
const strokeWidth = d3.scaleLinear().range([3, 10]); // added this line

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
});

function update(user) {
    let filtered;
    if (user === 'todos') {
        filtered = nodos;
    } else {
        filtered = nodos.filter(d => d.user === user);
    }
    createSimulation(filtered);
    draw(chart, filtered);
}

function createSimulation(nodos) {
    sim = d3.forceSimulation(nodos)
        .force('manybody', d3.forceManyBody().strength(200))
        .force('center', d3.forceCenter())
        .force('y', d3.forceY().strength(0.1))
        // .force('collide', d3.forceCollide(d => radio(+d.danceability) + 1).strength(2).iterations(5))
        .force('collide', d3.forceCollide(d => radio(+d.danceability) +2).strength(2).iterations(5)) // added stroke width here
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
            tooltip.html(d.song + '<br/>' + '<br/>' + 'Danceability:' + d.danceability + '<br/>' + 'Energy:' + d.energy + '<br/>' + 'Valence:' + d.valence)
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
