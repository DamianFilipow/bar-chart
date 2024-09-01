import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'

function App() {
  const [dataSet, setDataSet] = useState(null);
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDataSet(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(dataSet)

  const svg = d3.select('main')
                .append('svg')
  return (
    <main>
      <h1 id='title'>United States GDP</h1>
    </main>
  )
 
}

export default App
