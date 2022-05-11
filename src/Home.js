import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";
import OverviewGraph from "./OverviewGraph";
import Data from "./Data";
import DetailsGraph from "./DetailsGraph";

function Home() {
  const [showOverview, setShowOverview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showOpening, setShowOpening] = useState(true);
  const [data, setData] = React.useState({});
  const [ageGroupData, setAgeGroup] = useState({});

  useEffect(() => {
    let load = async () => {
      let data = new Data();
      setData(data);
      await data.getData();
      await data.processData();
    };
    load();
  }, []);
  return (
    <div>
      {showOverview ? (
        <>
          <p id="info">Press a bar to Learn More About an Age Range</p>
          <OverviewGraph
            data={data}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            showOverview={showOverview}
            setShowOverview={setShowOverview}
            setAgeGroup={setAgeGroup}
          />
        </>
      ) : undefined}

      {showOpening ? (
        <div id="intro">
          <p className="title">
            A Narrative Visualization of the 2020 Annual CDC Survey Data of
            400,000 Adults Related To Their Health Status
          </p>
          <p>By Alexander Gronowski</p>
          <p>
            Source:
            https://www.kaggle.com/datasets/kamilpytlak/personal-key-indicators-of-heart-disease
          </p>

          <button
            onClick={() => {
              setShowOverview(true);
              setShowOpening(false);
            }}
            className="button-9"
          >
            Explore CDC Heart Disease Survey
          </button>
        </div>
      ) : undefined}

      {showDetails ? (
        <DetailsGraph
          ageGroupData={ageGroupData}
          setShowOverview={setShowOverview}
          setShowDetails={setShowDetails}
        />
      ) : undefined}
    </div>
  );
}

export default Home;
