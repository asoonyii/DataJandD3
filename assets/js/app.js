// @TODO: YOUR CODE HERE!
// Sizing
var svgWidth = 950;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Get Data
d3.csv("assets/data/data.csv", function(err, chartData) {
  if (err) throw err;
  //Cast as numbers
  chartData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });

  //scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([30, d3.max(chartData, d => d.age)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([8, d3.max(chartData, d => d.smokes)])
    .range([height, 0]);

  // axis functions and append to chart
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   //circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(chartData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.age))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "15")
  .attr("fill", "orangered")
  .attr("opacity", .70)
  .attr("class", "chart")

    chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "white")
    .selectAll("tspan")
    .data(chartData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.age);
        })
        .attr("y", function(data) {
            return (yLinearScale(data.smokes)+5);
        })
        .text(function(data) {
            return data.abbr
        });

// Tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`State: ${d.abbr}<br>Age: ${d.age}<br>Smokers: ${d.smokes}`);
    });
  chartGroup.call(toolTip);

  // Event Listener
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2) - 100)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Percent of Smokers")
    .style("font-size", "25px")
    .style("font-weight", "bold")
    .style("fill", "rgb(116, 3, 3)");

  chartGroup.append("text")
    .attr("transform", `translate(${(width / 2)-50}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Average Age")
    .style("font-size", "25px")
    .style("font-weight", "bold")
    .style("fill", "rgb(116, 3, 3)");
});