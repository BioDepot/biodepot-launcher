import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { init } from "@neutralinojs/lib";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// in dev mode the storageToken will be stored - and we set the port to be constant 42000 
const storedToken = sessionStorage.getItem('NL_TOKEN');
if (storedToken){
  window.NL_PORT = '42000';
  window.NL_TOKEN = storedToken;
}
console.log(window.NL_TOKEN,window.NL_PORT);
init();
