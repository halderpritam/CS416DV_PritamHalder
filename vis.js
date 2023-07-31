// --------------------------------------------------------------------------------// 
// D3 Code for CS 416 Project - By Pritam Halder
// --------------------------------------------------------------------------------// 

// --------------------------------------------------------------------------------// 
// SETUP --------------------------------------------------------------------------//
// --------------------------------------------------------------------------------// 

// Retrieve the scenes
var scene1 = d3.select('#scene1')
var scene2 = d3.select('#scene2')
var scene3 = d3.select('#scene3')

// constants
var width = 900
var height = 900

var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var cylindersList = ["3", "4", "5", "6", "8", "10", "12", "16"]
var airPollutionScoreList = ["1", "3", "5", "6", "7", "8"]

// Parsed car data array and its elements
const carDataArray = [];
const model = 0;
const engine = 1;
const cylinder = 2;
const transmission = 3;
const drive = 4;
const vehicleClass = 5;
const aps = 6;
const cMPG = 7;
const hMPG = 8;
const combMPG = 9;
const emission = 10;

function loadCSV(data_given, carDataArray) {
    for (var key of Object.values(data_given)) {
        var valueArray = [key.Model, key.EngineDisplacement, key.Cylinders, key.Trans, key.Drive, key.VehClass, key.AirPollutionScore, key.CityMPG, key.HwyMPG, key.CmbMPG, key.CombCO2];
        var csvValue = valueArray.join(',');
        carDataArray.push(csvValue);
    }
}

// Helper function to add jitter to the data points
function getRandomJitter(jitterAmount) {
    return (Math.random() - 0.5) * jitterAmount;
}

document.getElementById('reloadLink1').addEventListener("click", function (event) {
    event.preventDefault(); 
    location.reload();
});
document.getElementById('reloadLink2').addEventListener("click", function (event) {
    event.preventDefault();
    location.reload();
});
document.getElementById('reloadLink3').addEventListener("click", function (event) {
    event.preventDefault();
    location.reload();
});

// -------------------------------------------------------------------------------- // 
// SCENE ONE ---------------------------------------------------------------------- //
// -------------------------------------------------------------------------------- // 

// ---------------------------Setup Start for Scene 1------------------------------ //
// Axis labels
scene1.append('text')
    .attr('x', -400)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Highway MPG');
scene1.append('text')
    .attr('x', 400)
    .attr('y', 800)
    .attr('text-anchor', 'middle')
    .text('City MPG');

// Scale setup
const xScale1 = d3.scaleLinear()
    .domain([0, 70])
    .range([0, width]);
const yScale1 = d3.scaleLinear()
    .domain([0, 70])
    .range([height, 0]);

// Create the SVG container for the scatter plot
const scene1SVG = scene1.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Add x axis
scene1SVG.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale1));
// Add y axis
scene1SVG.append('g')
    .call(d3.axisLeft(yScale1));

var bar_tooltip1 = d3.select("body")
    .append("div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("border-radius", "5px")
    .style("padding", "15px")
    .style("font-family", "Helvetica Neue, sans-serif")
    .style("font-size", "12px")
    .style("color", "black")
    .style("background-color", "orange");

// ---------------------------Setup End for Scene 1------------------------------ //

async function load1() {
    d3.csv("https://raw.githubusercontent.com/halderpritam/CS416DV_PritamHalder/main/Cars_2023.csv").then(function (data_given) {
        loadCSV(data_given, carDataArray);

        updateScatterPlot1(carDataArray);
    })
}

// Attach an event handler to the dropdown
document.getElementById('vehicleclass').addEventListener('change', handleDropDownChange);

// This function is called by the dropdown on top of the plot
function handleDropDownChange() {
    var carClass = document.getElementById('vehicleclass').value;
    if (carClass == "all class type") {
        updateScatterPlot1(carDataArray);
        return;
    }
    var filteredCarData = filterCarDatabasedOnClass(carDataArray, carClass);
    updateScatterPlot1(filteredCarData);
}

// Create filtered card data array
function filterCarDatabasedOnClass(baseCarData, carclass) {
    var filterCarData = [];
    for (var key of Object.values(baseCarData)) {
        var carClassData = key.split(',')[vehicleClass];
        if (carclass == carClassData) {
            filterCarData.push(key);
        }
    }
    return filterCarData;
}

// Function to update the scatter plot data with a transition
function updateScatterPlot1(data) {
    const circles = scene1SVG.selectAll('circle')
        .data(data.filter(d => +d.split(',')[cMPG] !== 0 || +d.split(',')[hMPG] !== 0));

    circles.exit().remove();

    // Define a color scale for different categories
    const colorScale = d3.scaleOrdinal()
        .domain(cylindersList)
        .range(d3.schemeCategory10);

    circles.enter()
        .append('circle')
        .attr('r', 4)
        .attr("cx", d => xScale1(+d.split(',')[cMPG] + getRandomJitter(1))) // Start each circle at the left edge of the plot
        .attr('cy', d => yScale1(+d.split(',')[hMPG]) + getRandomJitter(1))
        .style('opacity', 0)
        .transition()
        .duration(150)
        .delay((d, i) => i * 5)
        .style('opacity', .8)
        .attr('fill', d => colorScale(d.split(',')[cylinder]))
        .on("end", function () {
            d3.select(this).on("mouseover", function (event, d) {
                bar_tooltip2.transition()
                    .duration(200)
                    .style("opacity", 1);
                bar_tooltip2.html(GetHtmlContent1(d))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
                .on("mouseout", function (d) {
                    bar_tooltip2.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
        });
}

function GetHtmlContent1(data) {
    var detailsArray = data.split(',');
    return detailsArray[model] + ", " + detailsArray[drive] + ", " + detailsArray[cylinder] + "Cyl, " + detailsArray[hMPG] + "/" + detailsArray[cMPG];
}

function zoomed(event) {
    var transform = event.transform;
    scene1SVG.selectAll("circle")
        .attr("transform", transform);
}

// TODO Disbale zoom and enable brushing
// --------------------------------------------------------------------------------// 
// SCENE TWO ----------------------------------------------------------------------//
// --------------------------------------------------------------------------------// 

// ---------------------------Setup Start for Scene 2------------------------------//
// Axis labels
scene2.append('text')
    .attr('x', -400)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Engine Displacement');
scene2.append('text')
    .attr('x', 400)
    .attr('y', 800)
    .attr('text-anchor', 'middle')
    .text('Combine MPG');

// Scale setup
const xScale2 = d3.scaleLinear()
    .domain([0, 70])
    .range([0, width]);
const yScale2 = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

// Create the SVG container for the scatter plot
const scene2SVG = scene2.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Add x axis
scene2SVG.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale2));
// Add y axis
scene2SVG.append('g')
    .call(d3.axisLeft(yScale2));

var bar_tooltip2 = d3.select("body")
    .append("div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("border-radius", "5px")
    .style("padding", "15px")
    .style("font-family", "Helvetica Neue, sans-serif")
    .style("font-size", "12px")
    .style("color", "black")
    .style("background-color", "cyan");

// ---------------------------Setup End for Scene 2------------------------------ //

async function load2() {
    d3.csv("https://raw.githubusercontent.com/halderpritam/CS416DV_PritamHalder/main/Cars_2023.csv").then(function (data_given) {
        loadCSV(data_given, carDataArray);

        updateScatterPlot2(carDataArray);
    })
}

// Function to update the scatter plot data with a transition
function updateScatterPlot2(data) {
    const circles = scene2SVG.selectAll('circle')
        .data(data.filter(d => +d.split(',')[combMPG] !== 0 || +d.split(',')[engine] !== 0));

    circles.exit().remove();

    var myColor = d3.scaleOrdinal()
        .domain(cylindersList)
        .range(["red", "yellow", "orange", "magenta", "MediumTurquoise", "green", "violet", "cyan"]);

    // Configuring legend    
    const legendItems = scene2SVG.append('g')
        .append('g')
        .attr("transform", `translate(${width - 20}, 200)`)
        .selectAll(".legend")
        .data(cylindersList)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => myColor(cylindersList.map(d => d)));

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d + " Cyl")
        .style("user-select", "none");

    circles.enter()
        .append('circle')
        .attr('r', 4)
        .attr("cx", width) // Start each circle at the left edge of the plot
        .attr('cy', 0)
        .transition()
        .duration(150)
        .delay((d, i) => i * 5)
        .attr('cx', d => xScale2(+d.split(',')[combMPG] + getRandomJitter(1)))
        .attr('cy', d => yScale2(+d.split(',')[engine] + getRandomJitter(1)))
        .attr('fill', d => myColor(d.split(',')[cylinder]))
        .style('opacity', .8)
        .on("end", function () {
            d3.select(this).on("mouseover", function (event, d) {
                bar_tooltip2.transition()
                    .duration(200)
                    .style("opacity", 1);
                bar_tooltip2.html(GetHtmlContent2(d))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
                .on("mouseout", function (d) {
                    bar_tooltip2.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
        });

    legendItems.on("mouseover", function (event, d) {
        // Get the category from the current legend item
        const category = d;
        // Toggle visibility of the circles based on the selected category
        scene2SVG.selectAll('circle').style("display", function (d) {
            return d.split(',')[cylinder] === category ? "inline" : "none";
        });
    });

    legendItems.on("click", function (event, d) {
        scene2SVG.selectAll('circle').style("display", "inline");
    });
}

function GetHtmlContent2(data) {
    var detailsArray = data.split(',');
    return detailsArray[model] + ", " + detailsArray[transmission];
}

// --------------------------------------------------------------------------------// 
// SCENE THREE --------------------------------------------------------------------//
// --------------------------------------------------------------------------------// 

// ---------------------------Setup Start for Scene 3------------------------------//
// Axis labels
scene3.append('text')
    .attr('x', -400)
    .attr('y', 11)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Engine Displacement');
scene3.append('text')
    .attr('x', 400)
    .attr('y', 800)
    .attr('text-anchor', 'middle')
    .text('Combine Co2 Emission');

// Scale setup
const xScale3 = d3.scaleLinear()
    .domain([0, 1200])
    .range([0, width]);
const yScale3 = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

// Create the SVG container for the scatter plot
const scene3SVG = scene3.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// Add x axis
var xAxis = scene3SVG.append("g")
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale3));
// Add y axis
var yAxis = scene3SVG.append("g")
    .call(d3.axisLeft(yScale3));

var bar_tooltip3 = d3.select("body")
    .append("div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "cyan")
    .style("border-radius", "5px")
    .style("padding", "15px")
    .style("font-family", "Helvetica Neue, sans-serif")
    .style("font-size", "12px")
    .style("color", "black");

// ---------------------------Setup End for Scene 3------------------------------ //

async function load3() {
    d3.csv("https://raw.githubusercontent.com/halderpritam/CS416DV_PritamHalder/main/Cars_2023.csv").then(function (data_given) {
        loadCSV(data_given, carDataArray);

        updateScatterPlot3(carDataArray);
    })
}

function updateScatterPlot3(data) {

    // Define a color scale for different categories
    const colorScale = d3.scaleOrdinal()
        .domain(airPollutionScoreList)
        .range(["maroon", "purple", "red", "orange", "yellow", "green"]);

    // Configuring legend    
    const legendItems = scene3SVG.append('g')
        .append('g')
        .attr("transform", `translate(${width - 20}, 200)`)
        .selectAll(".legend")
        .data(airPollutionScoreList)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", d => colorScale(airPollutionScoreList.map(d => d)));

    legendItems.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d + " Aps")
        .style("user-select", "none");

    // Add circles
    scene3SVG.selectAll("circle")
        .data(data.filter(d => +d.split(',')[engine] !== 0 || +d.split(',')[emission] !== 0))
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", d => xScale3(+d.split(',')[emission] + getRandomJitter(1)))
        .attr("cy", d => yScale3(+d.split(',')[engine] + getRandomJitter(1)))
        .style("fill", d => colorScale(d.split(',')[aps]))
        .style('opacity', 0)
        .transition()
        .duration(150)
        .delay((d, i) => i * 5)
        .style('opacity', .8)
        .on("end", function () {
            d3.select(this).on("mouseover", function (event, d) {
                bar_tooltip2.transition()
                    .duration(200)
                    .style("opacity", 1);
                bar_tooltip2.html(GetHtmlContent3(d))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
                .on("mouseout", function (d) {
                    bar_tooltip2.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
        });

    legendItems.on("mouseover", function (event, d) {
        // Get the category from the current legend item
        const category = d;
        // Toggle visibility of the circles based on the selected category
        scene3SVG.selectAll('circle').style("display", function (d) {
            return d.split(',')[aps] === category ? "inline" : "none";
        });
    });

    legendItems.on("click", function (event, d) {
        scene3SVG.selectAll('circle').style("display", "inline");
    });

}

function GetHtmlContent3(data) {
    var detailsArray = data.split(',');
    return detailsArray[model] + ", " + detailsArray[combMPG] + ", " + detailsArray[aps];
}

// -----------------------------------End of Scene 3------------------------------------ //