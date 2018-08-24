import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import './App.css';
import MapContainer from './MapContainer';

class SearchForPlacesApp extends Component {

  render() {
    return (<div className="app">

      <Route exact path='/' render={() => (<MapContainer/>)}/>

    </div>);
  }
}

export default SearchForPlacesApp;
