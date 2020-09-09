import React from 'react';
import * as d3 from 'd3';
import './App.css';

const tables = [
	{
		name: 'people',
		columns: 10,
		references: 5
	}, 	{
		name: 'planets',
		columns: 10,
		references: 3
	}, 	{
		name: 'species',
		columns: 10,
		references: 2
	},	{
		name: 'films',
		columns: 10,
		references: 4
	}
];

const width = 1000;
const height = 800;
const radius = 20;
const simulation = d3.forceSimulation()
	.force('center', d3.forceCenter(width / 2, height /2))
	// .force('charge', d3.forceManyBody())
	.force('collide', d3.forceCollide(radius))
	.stop();

class App extends React.Component {
	constructor(props) {
		super(props);

		this.forceTick = this.forceTick.bind(this);
	}

	componentWillMount() {
		simulation.on('tick', this.forceTick);
	}

	componentDidMount() {
		this.container = d3.select(this.refs.container)
		// console.log(this.refs.container, svg)
		this.renderCircles();

		simulation.nodes(tables).alpha(0.9).restart();
	}

	renderCircles() {
		// draw tableName in circles
		this.circles = this.container.selectAll('circle').data(tables, d => d.name);

		// exit
		this.circles.exit().remove();

		// enter + update
		this.circles = this.circles.enter().append('circle')
			.merge(this.circles)
			.attr('r', radius)
			.attr('opacity', 0.5)
	}

	forceTick() {
		this.circles.attr('cx', d => d.x).attr('cy', d => d.y)
	}

  render() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
				<svg width={width} height={height} ref='container'></svg>
      </div>
    );
  }
}

export default App;
