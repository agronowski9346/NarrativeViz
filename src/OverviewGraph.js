import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";
import Data from "./Data";

function OverviewGraph({
  data,
  showDetails,
  setShowDetails,
  showOverview,
  setShowOverview,
  setAgeGroup,
}) {
  useEffect(() => {
    let makeGraph = async () => {
      console.log(data);
      const spacing = 50;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let svg = d3
        .select("div#graph-overview")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .style("background-color", "white");

      let p = d3.select("div").append("p").attr("id", "tooltip");

      let onMouseOver = (event, d) => {
        let totalPeople = d.noDiseaseCount + d.hasDiseaseCount;
        d3.select("#tooltip")
          .classed("show", true)
          .style("top", event.clientY + "px")
          .style("left", event.clientX + "px")
          .html(
            `
          Age Range: ${d.ageRange}
          <br />
          Total People in Study: ${totalPeople}
          <br />
          Percent With Heart Disease: ${d.hasDiseaseCountPercent.toFixed(2)}
          <br />
          Percent Without Heart Disease: ${d.noDiseaseCountPercent.toFixed(2)}
          `
          );
        d3.select("#tooltip").classed("hide", false);
      };

      let onMouseOut = (e) => {
        d3.select("#tooltip").classed("show", false);
        d3.select("#tooltip").classed("hide", true);
      };

      let onMouseMove = (event) => {
        d3.select("#tooltip")
          .style("top", event.clientY + "px")
          .style("left", event.clientX + "px");
      };

      let onClick = (e, d, i) => {
        setShowOverview(false);
        setShowDetails(true);
        d3.select("#tooltip").classed("hide", true);
        console.log(d);
        setAgeGroup(d);
      };

      let heartDiseaseByAge = data.groupByAge();

      let yScaleAxis = d3
        .scaleLinear()
        .domain([100, 0])
        .range([spacing, height - spacing]);
      let yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, height - spacing * 2]);

      let yAxis = d3.axisLeft(yScaleAxis).ticks(10);
      svg
        .append("g")
        .attr("transform", "translate(" + spacing + ", 0)")
        .call(yAxis);

      let xScale = d3
        .scaleBand()
        .range([spacing, width - spacing])
        .padding(0.1)
        .domain(d3.range(heartDiseaseByAge.length));

      let xLabel = data.getAgeRangesSorted();
      let xLabelCount = xLabel.length;
      let xAxis = d3
        .axisBottom(xScale)
        .ticks(xLabelCount)
        .tickFormat((d) => xLabel[d]);

      let gXAxis = svg
        .append("g")
        .attr("transform", "translate(" + 0 + ", " + (height - spacing) + ")");
      gXAxis
        .append("text")
        .text("Age Groups")
        .attr("fill", "black")
        .attr("transform", "translate(" + width / 2 + ", " + 30 + ")");
      gXAxis.call(xAxis);

      let rectsHealthy = svg.selectAll("rect").data(heartDiseaseByAge);
      let rectsUnhealthy = svg.selectAll("rect").data(heartDiseaseByAge);

      //healthy rects
      rectsHealthy
        .enter()
        .append("rect")
        .on("mouseover", (event, d, i) => {
          onMouseOver(event, d, i);
        })
        .on("mouseout", (e) => {
          onMouseOut(e);
        })
        .on("mousemove", (e) => {
          onMouseMove(e);
        })
        .on("click", (event, d, i) => {
          onClick(event, d, i);
        })
        .transition() // <---- Here is the transition
        .duration(1500)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => {
          return yScale(d.noDiseaseCountPercent);
        })
        .attr("x", (d, i) => {
          return xScale(i);
        })
        .attr("y", (d) => height - yScale(d.noDiseaseCountPercent) - spacing)
        .attr("fill", "#0091DA");

      //unhealthy rects
      rectsUnhealthy
        .enter()
        .append("rect")
        .on("mouseover", (event, d, i) => {
          onMouseOver(event, d, i);
        })
        .on("mouseout", (e) => {
          onMouseOut(e);
        })
        .on("mousemove", (e) => {
          onMouseMove(e);
        })
        .on("click", (event, d, i) => {
          onClick(event, d, i);
        })
        .transition() // <---- Here is the transition
        .duration(3000)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => yScale(d.hasDiseaseCountPercent))
        .attr("x", (d, i) => xScale(i))
        .attr(
          "y",
          (d) =>
            height -
            yScale(d.hasDiseaseCountPercent) -
            yScale(d.noDiseaseCountPercent) -
            spacing
        )
        .attr("fill", "#E52E2E");

      rectsUnhealthy
        .on("mouseover", (event, d, i) => {
          onMouseOver(event, d, i);
        })
        .on("mouseout", (e) => {
          onMouseMove(e);
        })
        .on("mousemove", (e) => {
          onMouseMove(e);
        });
    };

    makeGraph();
  }, [data]);
  return <div id="graph-overview"></div>;
}

export default OverviewGraph;
