console.log("Hello World");
// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {


  // Use `d3.json` to fetch the metadata for a sample
  var metaURL = (`/metadata/${sample}`);
  d3.json(metaURL).then(function (data) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var metaTable = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    metaTable.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      metaTable.append("p").text(`${key}: ${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotURL = (`/samples/${sample}`);
  d3.json(plotURL).then(function (plotData) {
    var ids = plotData.otu_ids;
    var otu_labels = plotData.otu_labels;
    var values = plotData.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleChart = {
      x: ids,
      y: values,
      mode: 'markers',
      marker: {
        size: values,
        color: ids 
      },
      text: otu_labels
    };

    var layout = {
      xaxis:{
        title: "OTU ID"
      }
    };

    var data = [bubbleChart];

    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieChart = {
      labels: ids.slice(0, 10),
      values: values.slice(0, 10),
      type: "pie",
      hoverinfo: otu_labels.slice(0, 10),
      textinfo: 'percent'
    };

    var pieData = [pieChart];

    Plotly.newPlot("pie", pieData);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
