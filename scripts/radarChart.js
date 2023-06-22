var gonza = [{'axis': 'danceability', 'value': 0.58465}, {'axis': 'energy', 'value': 0.7542}, {'axis': 'loudness', 'value': 0.882063069255886}, {'axis': 'valence', 'value': 0.72105}, {'axis': 'tempo', 'value': 0.5813314454691259}, {'axis': 'acousticness', 'value': 0.069595005}];
var nico = [{'axis': 'danceability', 'value': 0.6521}, {'axis': 'energy', 'value': 0.80285}, {'axis': 'loudness', 'value': 0.8196575872142982}, {'axis': 'valence', 'value': 0.18328}, {'axis': 'tempo', 'value': 0.44782310879444004}, {'axis': 'acousticness', 'value': 0.045038}];
var flori = [{'axis': 'danceability', 'value': 0.49284999999999995}, {'axis': 'energy', 'value': 0.195473}, {'axis': 'loudness', 'value': 0.4480838632067366}, {'axis': 'valence', 'value': 0.35995}, {'axis': 'tempo', 'value': 0.4303185979684576}, {'axis': 'acousticness', 'value': 0.8272}];
var allData = {
  gonza: { active: true, data: gonza, color: "#8b1874" },
  nico: { active: true, data: nico, color: "#fc4f00" },
  flori: { active: true, data: flori, color: "#6C9BCF" },
};

// function buttonClick_RC(buttonId) {
//   allData[buttonId].active = !allData[buttonId].active; // Toggle active state

//   // Build data and color arrays with only active data
//   var data = [];
//   var colors = [];
//   for (var key in allData) {
//     if (allData[key].active) {
//       data.push(allData[key].data);
//       colors.push(allData[key].color);
//     }
//   }

//   RadarChart(".radarChart", data, colors); // Pass colors to RadarChart function
// }

// Initial draw
var data = [gonza, nico, flori];
var colors = ["#8b1874", "#fc4f00", "#6C9BCF"];
RadarChart(".radarChart", data, colors); // Pass colors to RadarChart function

function RadarChart(id, data, colors) {
  const margin = { top: 100, right: 100, bottom: 100, left: 100 };
  const width =
    Math.min(700, window.innerWidth - 10) - margin.left - margin.right;
  const height = Math.min(
    width,
    window.innerHeight - margin.top - margin.bottom - 20
  );

  const color = d3
    .scaleOrdinal()
    // .domain(['gonza', 'nico', 'flori'])
    .range(colors);

  const options = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 5,
    roundStrokes: true,
    color: color,
  };

  const cfg = {
    w: 600,
    h: 600,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    levels: 3,
    maxValue: 0,
    labelFactor: 1.25,
    wrapWidth: 60,
    opacityArea: 0.35,
    dotRadius: 4,
    opacityCircles: 0.1,
    strokeWidth: 2,
    roundStrokes: false,
    color: d3.scaleOrdinal(),
  };

  // Put all of the options into a variable called cfg
  if (typeof options !== "undefined") {
    for (const i in options) {
      if (typeof options[i] !== "undefined") {
        cfg[i] = options[i];
      }
    }
  }

  // If the supplied maxValue is smaller than the actual one, replace by the max in the data
  const maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, (i) => d3.max(i.map((o) => o.value)))
  );

  const allAxis = data[0].map((i) => i.axis);
  const total = allAxis.length;
  const radius = Math.min(cfg.w / 2, cfg.h / 2);
  const formatPercent = d3.format(".0%"); // Updated formatting function
  const angleSlice = (Math.PI * 2) / total;

  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  d3.select(id).select("svg").remove();

  const svg = d3
    .select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr("class", "radar" + id);

  const g = svg
    .append("g")
    .attr(
      "transform",
      `translate(${cfg.w / 2 + cfg.margin.left},${cfg.h / 2 + cfg.margin.top})`
    );

  const filter = g.append("defs").append("filter").attr("id", "glow");
  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "2.5")
    .attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const axisGrid = g.append("g").attr("class", "axisWrapper");

  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d, i) => (radius / cfg.levels) * d)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", (d) => -d * (radius / cfg.levels))
    .attr("dy", "0.4em")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("font-family", "Courier New")
    .attr("fill", "#737373")
    .text((d, i) => formatPercent(maxValue * (d / cfg.levels))); // Updated formatting function

  const axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr(
      "x2",
      (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y2",
      (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("font-family", "Courier New")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr(
      "x",
      (d, i) =>
        rScale(maxValue * cfg.labelFactor) *
        Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y",
      (d, i) =>
        rScale(maxValue * cfg.labelFactor) *
        Math.sin(angleSlice * i - Math.PI / 2)
    )
    .text((d) => d)
    .call(wrap, cfg.wrapWidth);

  const radarLine = d3
    .lineRadial()
    .curve(d3.curveLinearClosed)
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice);

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }
  const blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", (d, i) => radarLine(d))
    .style("fill", (d, i) => cfg.color(i))
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function (d, i) {
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);
      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", (d, i) => radarLine(d))
    .style("stroke-width", `${cfg.strokeWidth}px`)
    .style("stroke", (d, i) => cfg.color(i))
    .style("fill", "none")
    .style("filter", "url(#glow)");

  blobWrapper
    .selectAll(".radarCircle")
    .data((d, i) => d)
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr(
      "cx",
      (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "cy",
      (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .style("fill", (d, i, j) => cfg.color(j))
    .style("fill-opacity", 0.8);

  const blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data((d, i) => d)
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr(
      "cx",
      (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "cy",
      (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (event, d) {
      const newX = parseFloat(d3.select(this).attr("cx")) - 10;
      const newY = parseFloat(d3.select(this).attr("cy")) - 10;

      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(formatPercent(d.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  const tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

  function wrap(text, width) {
    text.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.4;
      const y = text.attr("y");
      const x = text.attr("x");
      const dy = parseFloat(text.attr("dy"));
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", `${dy}em`);

      let word;
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", `${++lineNumber * lineHeight + dy}em`)
            .text(word);
        }
      }
    });
  }
}
