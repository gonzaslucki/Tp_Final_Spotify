let nodos;
let chart;
let sim;
const width = 1700;
const height = 1000;

const color = d3.scaleOrdinal()
    .domain(['gonza', 'nico', 'flori'])
    .range(['blue', 'green', 'black']);

const opacidad = d3.scaleLinear().range([.1, 1]);
const radio = d3.scaleRadial().range([8, 80]);

d3.csv('../data/data.csv', d3.autoType).then(data => {
    nodos = data;
    opacidad.domain(d3.extent(nodos, d => d.loudness));
    radio.domain(d3.extent(nodos, d => +d.danceability));

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
        .force('collide', d3.forceCollide(d => radio(+d.danceability) + 1).strength(2).iterations(5))
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
        .style('fill-opacity', d => opacidad(d.loudness));


    sessions
        .append('text')
        .text(d => d[","])
        .attr('y', d => radio(+d.danceability) / 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', d => {
            const size = radio(+d.danceability) / 4;
            if (size > 14) {
                return size + 'px';
            }
            return 0;
        });

}

function redraw() {
    d3.selectAll('.session').attr('transform', d => `translate(${[d.x, d.y]})`);
}
