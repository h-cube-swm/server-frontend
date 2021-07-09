import { Component } from 'react';
import './App.css'
import Intro from '../Intro/Intro';
import Header from '../Header/Header';
import Service from '../Service/Service';

function App() {
  return (
    <div>
      <Header />
      <Intro />
      {/* <Service /> */}
    </div>
  );
}

export default App;
