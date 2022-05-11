import React, { useEffect } from "react";
import * as d3 from "d3";

let DetailsGraph = ({ ageGroupData, setShowOverview, setShowDetails }) => {
  useEffect(() => {
    console.log("Details Graph Data is " + ageGroupData);
    let {
      alcoholDrinkingCount,
      asthmaCount,
      diabeticCount,
      hasDiseaseCount,
      obeseCount,
      overWeightCount,
      smokingCount,
    } = ageGroupData;
    let data = [
      { label: "Smoking", percentage: (smokingCount / hasDiseaseCount) * 100 },
      { label: "Asthma", percentage: (asthmaCount / hasDiseaseCount) * 100 },
      {
        label: "Diabetes",
        percentage: (diabeticCount / hasDiseaseCount) * 100,
      },
      { label: "Obesity", percentage: (obeseCount / hasDiseaseCount) * 100 },
      {
        label: "Overweight",
        percentage: (overWeightCount / hasDiseaseCount) * 100,
      },
      {
        label: "Alcohol",
        percentage: (alcoholDrinkingCount / hasDiseaseCount) * 100,
      },
    ];

    for (let i = 0; i < data.length; i++) {
      console.log(data[i].label + " " + data[i].percentage);
    }

    let makeGraph = async () => {
      console.log(data);
      const spacing = 50;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let svg = d3
        .select("div#graph-detail")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .style("background-color", "white");

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
        .domain(d3.range(data.length));

      let xAxis = d3
        .axisBottom(xScale)
        .ticks(data.length)
        .tickFormat((i) => {
          return data[i].label;
        });

      let gXAxis = svg
        .append("g")
        .attr("transform", "translate(" + 0 + ", " + (height - spacing) + ")");
      gXAxis
        .append("text")
        .text("Underlying Conditions")
        .attr("fill", "black")
        .attr("transform", "translate(" + width / 2 + ", " + 30 + ")");
      gXAxis.call(xAxis);

      let rectsHealthy = svg.selectAll("rect").data(data);

      //healthy rects
      rectsHealthy
        .enter()
        .append("rect")
        .transition() // <---- Here is the transition
        .duration(1500)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => {
          return yScale(d.percentage);
        })
        .attr("x", (d, i) => {
          return xScale(i);
        })
        .attr("y", (d) => height - yScale(d.percentage) - spacing)
        .attr("fill", "#0091DA");
    };

    makeGraph();
  }, [ageGroupData]);
  return (
    <div id="graph-detail">
      <button
        onClick={() => {
          setShowOverview(true);
          setShowDetails(false);
        }}
        className="button-9 back-button"
      >
        Back
      </button>
      <p className="center">
        Profile for People Ages: {ageGroupData.ageRange} Who Have Heart Disease
      </p>
    </div>
  );
};

export default DetailsGraph;
