// Load data from Netflix Titles CSV file
d3.csv("Netflix-titles.csv").then(function(data) {
    
    // Convert numerical values from string to integer
    data.forEach(function(d) {
        d.release_year =+ d.release_year;
    });

    // Create SVG container bar-chart-container
    var svg = d3.select("#bar-chart-container")
                .append("svg")
                .attr("width", 800)
                .attr("height", 600);

    // Title for SVG
    svg.append("text")
       .attr("x", 400)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "20px")
       .text("Count of Ratings of Movies Released");

    // Define scales
    var xScale = d3.scaleBand()
                   .range([50, 750])
                   .padding(0.1);

    var yScale = d3.scaleLinear()
                   .range([550, 50]);

    // Function to update bar chart based on selected year from 2019,2020 and 2021

    function updateChart(selectedYear) {
        
        // Filter data for the selected year based on input from dropdown
        var filteredData = data.filter(function(d) {
            return d.release_year === selectedYear;
        });

        // Group data by rating and count movies
        var counts = d3.rollup(filteredData, v => v.length, d => d.rating);
        var countsArray = Array.from(counts, ([rating, count]) => ({ rating, count }));

        // Update scales domain based on the filtered data
        xScale.domain(countsArray.map(function(d) { return d.rating; }));
        yScale.domain([0, d3.max(countsArray, function(d) { return d.count; })]);

        // Remove previous axes because if we don't remove this it will overlap when we change the year
        svg.selectAll("g.axis").remove();

        // Remove previous axes because if we don't remove this it will overlap when we change the year
        svg.selectAll("rect").remove();

        // Draw bars with different colors based on the selected year and give different colour to each bar on mouse over
        var bars = svg.selectAll("rect")
            .data(countsArray)
            .enter()
            .append("rect")
            .attr("x", function(d) { return xScale(d.rating); })
            .attr("y", function(d) { return yScale(d.count); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return 550 - yScale(d.count); })
            .attr("fill", function(d) {
                if (selectedYear === 2019) {
                    return "#003f5c";
                } else if (selectedYear === 2020) {
                    return "#58508d";
                } else if (selectedYear === 2021) {
                    return "#bc5090";
                }
            })
            .on("mouseover", function(d) {
                if (selectedYear === 2019) {
                    d3.select(this).attr("fill", "#22a7f0");
                } else if (selectedYear === 2020) {
                    d3.select(this).attr("fill", "#232038");
                } else if (selectedYear === 2021) {
                    d3.select(this).attr("fill", "#471a34");
                }
               
            })
            .on("mouseout", function(d) {
                if (selectedYear === 2019) {
                    d3.select(this).attr("fill", "#003f5c");
                } else if (selectedYear === 2020) {
                    d3.select(this).attr("fill", "#58508d");
                } else if (selectedYear === 2021) {
                    d3.select(this).attr("fill", "#bc5090");
                }
            });

        // Add x-axis for rating
        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0, 550)")
           .call(d3.axisBottom(xScale));

        // Add y-axis for count of rating
        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(50, 0)")
           .call(d3.axisLeft(yScale));
    }

    // Initial chart with data for the year 2019
    updateChart(2019);

    // Add filter for selecting release year
    d3.select("#year-filter")
        .on("change", function() {
            var selectedYear = +d3.select(this).property("value");
            updateChart(selectedYear);
    });

  // Zoom variables
  var zoomFactor = 1.0;
  var zoomStep = 0.2; // Zoom step size

  // Add event listener for zoom in button
  d3.select("#zoom-in")
      .on("click", function() {
          zoomFactor += zoomStep;
          svg.transition()
              .duration(750)
              .call(zoom.scaleTo, zoomFactor);
      });

  // Add event listener for zoom out button
  d3.select("#zoom-out")
      .on("click", function() {
          zoomFactor -= zoomStep;
          svg.transition()
              .duration(750)
              .call(zoom.scaleTo, zoomFactor);
      });

  // Define zoom behavior
  var zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", function(event) {
          svg.attr("transform", event.transform);
      });

  // Apply zoom behavior to the SVG container
  svg.call(zoom);
   
});