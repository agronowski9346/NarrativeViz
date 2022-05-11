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
      let alcoholDrinkingCount = 0;
      let asthmaCount = 0;
      let diabeticCount = 0;
      let smokingCount = 0;
      let overWeightCount = 0;
      let obeseCount = 0;
      for (let i = 0; i < dataByAge.length; i++) {
        if (dataByAge[i].HeartDisease === "No") {
          noDiseaseCount++;
        } else {
          hasDiseaseCount++;
          if (dataByAge[i].AlcoholDrinking === "Yes") {
            alcoholDrinkingCount++;
          }
          if (dataByAge[i].Asthma === "Yes") {
            asthmaCount++;
          }
          if (dataByAge[i].Smoking === "Yes") {
            smokingCount++;
          }
          if (dataByAge[i].Diabetic === "Yes") {
            diabeticCount++;
          }
          let bmi = parseInt(dataByAge[i].BMI);
          if (bmi >= 30) {
            obeseCount++;
          } else if (bmi < 30 && bmi > 25) {
            overWeightCount++;
          }
        }
      }
      let total = noDiseaseCount + hasDiseaseCount;
      let graphData = {
        ageRange: key,
        noDiseaseCount: noDiseaseCount,
        hasDiseaseCount: hasDiseaseCount,
        noDiseaseCountPercent: (noDiseaseCount / total) * 100,
        hasDiseaseCountPercent: (hasDiseaseCount / total) * 100,
        alcoholDrinkingCount: alcoholDrinkingCount,
        asthmaCount: asthmaCount,
        smokingCount: smokingCount,
        diabeticCount: diabeticCount,
        obeseCount: obeseCount,
        overWeightCount: overWeightCount,
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

export default Data;
