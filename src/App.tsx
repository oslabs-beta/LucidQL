import React from 'react';
import CodeBox from './components/codebox';
import * as _d3 from 'd3';

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <CodeBox />
      </div>
    );
  }
}

export default App;
