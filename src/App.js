import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";

function App() {
  useEffect(() => {
    let makeGraph = async () => {
      let data = await d3.csv("heart_2020_cleaned.csv");
      console.log(data);
    };

    makeGraph();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
