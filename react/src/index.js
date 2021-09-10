import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

process.platform = 'win32'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);