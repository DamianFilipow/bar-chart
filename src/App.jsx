import React, { useState, useEffect } from 'react';
import * as d3 from 'd3'

function App() {

  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  const [gdp, setGdp] = useState('')
  const [date, setDate] = useState('')
  const [tooltipStyle, setTooltipStyle] = useState({ visibility: 'hidden' })
  const [tooltipDataDate, setTooltipDataDate] = useState('')

  const w = 1000;
  const h = 500;
  const margin = 50;

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error, status: ${response.status}`);
        }
        return response.json();
      })
      .then((dataSet) => {

        const {data} = dataSet

        const x = d3.scaleUtc()
                    .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])])
                    .range([margin, w - margin])
        
        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[1])])
                    .range([h - margin, margin])

        const svg = d3.select('main')
                      .append('svg')
                      .attr('width', w)
                      .attr('height', h)


        svg.append("g")
            .attr('id', 'x-axis')
            .attr('transform', `translate(0,${h - margin})`)
            .call(d3.axisBottom(x))

        svg.append("g")
            .attr('id', 'y-axis')
            .attr('transform', `translate(${margin}, 0)`)
            .call(d3.axisLeft(y))

        svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('data-date', (d) => d[0])
          .attr('data-gdp', (d) => d[1])
          .attr('class', 'bar')
          .attr('x', (d) => x(new Date(d[0])))
          .attr('y', (d) => y(d[1]))
          .attr('width', (w - 2 * margin) / data.length)
          .attr("height", (d) => h - margin - y(d[1]))
          .attr('fill', 'steelblue')
          .on('mouseover', (event, d) => {
            setGdp(d[1]);
            setDate(d[0]);
            setTooltipStyle({
              visibility: 'visible',
              left: `${event.pageX + 5}px`,
              top: `${event.pageY - 28}px`,
            });
            setTooltipDataDate(d[0])
          })
          .on('mouseout', () => {
            setTooltipStyle({ visibility: 'hidden' });
          });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    return () => {
      d3.selectAll('rect').on('mouseover', null).on('mouseout', null); 
    };

  }, []);

  return (
    <main>
      <h1 id='title'>United States GDP</h1>
      <div id='tooltip' style={tooltipStyle} data-date={tooltipDataDate}>{gdp}<br />{date}</div>
    </main>
  )
 
}

export default App
