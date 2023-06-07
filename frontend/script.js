const width = 1500
const height = 1000

/* User: categorical scale */
const color = d3.scaleOrdinal()
    .domain(['gonza', 'nico', 'flori'])
    .range(['blue', 'green', 'black'])

/* Linear scales: loudness and danceability */
const opacidad = d3.scaleLinear().range([.1, 1])
const radio = d3.scaleRadial().range([8, 80])

/* Fetch data */
d3.csv('../data/data.csv', d3.autoType).then(data => {
    const nodos = data

    /* Scale domains */
    opacidad.domain(d3.extent(nodos, d => d.loudness))
    radio.domain(d3.extent(nodos, d => +d.danceability))
  
    /* DOM */
    const svg = d3.select('#visualization').append('svg').attr('width', width).attr('height', height)
    const chart = svg
        .append('g')
        .attr('transform', `translate(${[width / 2, height / 2]})`)
  

    const sim = d3
        .forceSimulation(nodos)
        .force('manybody', d3.forceManyBody().strength(200))
        .force('center', d3.forceCenter())
        .force('y', d3.forceY().strength(0.1))
        .force(
            'collide',
            d3
                .forceCollide(d => radio(+d.danceability) + 1)
                .strength(2)
                .iterations(5),
        )
    /* Register observer */
    sim.on('tick', redraw)
    
    /* Render circles */
    draw(chart, nodos)
})

function draw(chart, nodos) {
    const sessions = chart
        .selectAll('g.session')
        .data(nodos)
        .join('g')
        .attr('class', 'session')
        .attr('transform', d => `translate(${[d.x, d.y]})`)

    sessions
        .append('circle')
        .attr('r', d => radio(+d.danceability))
        .style('fill', (d, i) => color(d.user))
        .style('fill-opacity', d => opacidad(d.loudness))

    sessions
        .append('text')
        .text(d => d[","])
        .attr('y', d => radio(+d.danceability) / 9)
        .attr('text-anchor', 'middle')
        .attr('font-size', d => {
            const size = radio(+d.danceability) / 3
            if (size > 12) {
                return size + 'px'
            }
            return 0
        })
}

function redraw() {
    d3.selectAll('.session').attr('transform', d => `translate(${[d.x, d.y]})`)
}
