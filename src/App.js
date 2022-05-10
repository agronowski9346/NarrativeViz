import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";

class Data {
  //key age-range -> [{}, {}, ...]
  dataMap = new Map();
  data = undefined;

  async getData() {
    //data from kaggle
    this.data = await d3.csv(
      "https://raw.githubusercontent.com/agronowski9346/NarrativeViz/main/src/heart_2020_cleaned.csv"
    );
  }

  async processData() {
    for (let i = 0; i < this.data.length; i++) {
      let dataPoint = this.data[i];
      if (this.dataMap.has(dataPoint.AgeCategory)) {
        this.dataMap.get(dataPoint.AgeCategory).push(dataPoint);
      } else {
        let arr = [];
        arr.push(dataPoint);
        this.dataMap.set(dataPoint.AgeCategory, arr);
      }
    }
  }

  getMaxMinY() {
    let maxCount = Number.MIN_VALUE;
    let minCount = Number.MAX_VALUE;
    for (const [key] of this.dataMap.entries()) {
      let dataByAge = this.dataMap.get(key);
      minCount = Math.min(dataByAge.length, minCount);
      maxCount = Math.max(dataByAge.length, maxCount);
    }
    return [minCount, maxCount];
  }

  groupByAge() {
    let heartDiseaseByAge = [];
    for (const [key] of this.dataMap.entries()) {
      let dataByAge = this.dataMap.get(key);
      let hasDiseaseCount = 0;
      let noDiseaseCount = 0;
      for (let i = 0; i < dataByAge.length; i++) {
        if (dataByAge[i].HeartDisease === "No") {
          noDiseaseCount++;
        } else {
          hasDiseaseCount++;
        }
      }
      let total = noDiseaseCount + hasDiseaseCount;
      let graphData = {
        ageRange: key,
        noDiseaseCount: noDiseaseCount,
        hasDiseaseCount: hasDiseaseCount,
        noDiseaseCountPercent: (noDiseaseCount / total) * 100,
        hasDiseaseCountPercent: (hasDiseaseCount / total) * 100,
      };
      heartDiseaseByAge.push(graphData);
    }

    heartDiseaseByAge.sort((a, b) => {
      a = a.ageRange.replace(/\D/g, "");
      b = b.ageRange.replace(/\D/g, "");
      a = Number(a);
      b = Number(b);
      if (a === 80) {
        a = 9999;
      }
      if (b === 80) {
        b = 9999;
      }

      return Number(a) - Number(b);
    });

    return heartDiseaseByAge;
  }

  getAgeRangesSorted() {
    let ranges = [];
    for (const [key] of this.dataMap.entries()) {
      ranges.push(key);
    }
    ranges.sort((a, b) => {
      a = a.replace(/\D/g, "");
      b = b.replace(/\D/g, "");
      a = Number(a);
      b = Number(b);
      if (a === 80) {
        a = 9999;
      }
      if (b === 80) {
        b = 9999;
      }

      return Number(a) - Number(b);
    });

    return ranges;
  }
}

function App() {
  useEffect(() => {
    let makeGraph = async () => {
      const spacing = 50;
      let width = window.innerWidth;
      let height = window.innerHeight;
      let svg = d3
        .select("div")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .style("background-color", "black");

      let data = new Data();
      await data.getData();
      await data.processData();
      let heartDiseaseByAge = data.groupByAge();
      let extent = data.getMaxMinY();
      console.log("extent[0] " + extent[0]);
      console.log("extent[1] " + extent[1]);
      let yScaleAxis = d3
        .scaleLinear()
        .domain([100, 0])
        .range([0, height - spacing]);
      let yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, height - spacing]);

      let yAxis = d3.axisLeft(yScaleAxis).ticks(10);
      svg
        .append("g")
        .attr("transform", "translate(" + spacing + ", 0)")
        .call(yAxis);

      let xScale = d3
        .scaleLinear()
        .domain([0, heartDiseaseByAge.length])
        .range([spacing, width]);

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
        .attr("fill", "white")
        .attr("transform", "translate(" + width / 2 + ", " + 30 + ")");
      gXAxis.call(xAxis);

      console.log(heartDiseaseByAge);

      let rects = svg.selectAll("rect").data(heartDiseaseByAge);
      //healthy rects
      rects
        .enter()
        .append("rect")
        .attr("width", width / xLabelCount)
        .attr("height", (d) => {
          console.log(d.ageRange + " " + d.noDiseaseCountPercent);
          return yScale(d.noDiseaseCountPercent);
        })
        .attr("x", (d, i) => {
          return i * (width / xLabelCount) + spacing;
        })
        .attr("y", (d) => height - yScale(d.noDiseaseCountPercent) - spacing)
        .attr("fill", "#0091DA");

      //unhealthy rects
      rects
        .enter()
        .append("rect")
        .attr("width", width / xLabelCount)
        .attr("height", (d) => {
          return yScale(d.hasDiseaseCountPercent);
        })
        .attr("x", (d, i) => {
          return i * (width / xLabelCount) + spacing;
        })
        .attr("y", (d) => {
          return (
            height -
            yScale(d.hasDiseaseCountPercent) -
            yScale(d.noDiseaseCountPercent) -
            spacing
          );
        })
        .attr("fill", "#E52E2E");
    };

    makeGraph();
  }, []);
  return <div></div>;
}

export default App;
