import React from 'react';
import './App.scss';
import Board from './components/board'
function App() {
  return (
    <div className="App">
      <div>
        <Board cols={15} rows={15}></Board>
      </div>
    </div>
  );
}

export default App;
