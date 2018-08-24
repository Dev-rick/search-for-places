import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './MapContainer.css';
import {bubble as Menu} from 'react-burger-menu';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import * as FetchAll from './FetchAll';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialCenter: {
        lat: 40.854885,
        lng: -73.9949465
      },
      style: {
        width: '100%',
        height: '100%'
      },
      zoom: 10,
      places: [
        {
          title: 'Park Ave Penthouse',
          location: {
            lat: 40.7713024,
            lng: -73.9632393
          }
        }, {
          title: 'Chelsea Loft',
          location: {
            lat: 40.7444883,
            lng: -73.9949465
          }
        }, {
          title: 'Union Square Open Floor Plan',
          location: {
            lat: 40.7347062,
            lng: -73.9895759
          }
        }, {
          title: 'East Village Hip Studio',
          location: {
            lat: 40.7281777,
            lng: -73.984377
          }
        }, {
          title: 'TriBeCa Artsy Bachelor Pad',
          location: {
            lat: 40.7195264,
            lng: -74.0089934
          }
        }, {
          title: 'Chinatown Homey Space',
          location: {
            lat: 40.7180628,
            lng: -73.9961237
          }
        }
      ],
      showingInfoWindow: false,
      menuOpen: false,
      query: '',
      markerPosition: {},
      markerInformation: []
    };
  }

  updateQuery = (query) => {
    this.setState({query: query.trim()})
  }

  windowHasClosed = () => {
    this.setState({markerInformation: [], showingInfoWindow: false})
  }

  clickedItem = (place) => {
    if (this.state.markerInformation.length === 0 || this.state.markerInformation[0].search(place.title) === -1) {
      this.setState({
        query: place.title.trim(),
        markerPosition: place.location,
        markerInformation: [`Name of the place: ${place.title}`],
        showingInfoWindow: true
      })
      this.getInformation(place)
      this.closeMenu()
    } else {
      this.closeMenu()
    }
  }

  getInformation = (place) => {
    FetchAll.fetchInformation(place).then((place) => {
      if (place.response.headerFullLocation) {
        this.setState((state) => ({
          markerInformation: state.markerInformation.concat([`Address: ${place.response.headerFullLocation}`])
        }))
      } else {
        this.setState((state) => ({
          markerInformation: state.markerInformation.concat([`Address: no address available`])
        }))
      }
    })
  }

  clickedMarker = (place) => {
    if (this.state.markerInformation.length === 0 || this.state.markerInformation[0].search(place.title) === -1) {
      this.setState({
        showingInfoWindow: true,
        markerPosition: place.location,
        markerInformation: [`Name of the place: ${place.title}`]
      })
      this.getInformation(place)
    } else {
      return
    }
  }

  clearQuery = () => {
    this.setState({query: ''})
  }

  handleStateChange(state) {
    this.setState({menuOpen: state.isOpen});
  }
  closeMenu() {
    this.setState({menuOpen: false});
  }
  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({showingInfoWindow: false, markerInformation: []})
    }
  };

  render() {
    const {
      markerInformation,
      initialCenter,
      markerPosition,
      query,
      style,
      zoom,
      places,
      showingInfoWindow
    } = this.state;
    const {google} = this.props;
    const {onMapClicked, clickedItem, clickedMarker} = this;

    let showingPlaces;
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingPlaces = places.filter((place) => match.test(place.title));
    } else {
      showingPlaces = places;
    }
    showingPlaces.sort(sortBy('name'));

    return (<div className="container">
      <header>
        <div>
          <Menu isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)} menuClassName={'burger-menu'}>
            <div role="list">
              <div role='presentation'>
                <div className="search-books-bar menu-item" role="listitem">
                  <div className="search-books-input-wrapper">
                    <label>
                      <span className="label-title">Search a place</span>
                      <input type="text" placeholder="Search a place" value={query} onChange={(event) => this.updateQuery(event.target.value)}/>
                    </label>
                  </div>
                </div>
              </div>
              {
                showingPlaces.map((place, index) => (<div role='presentation' key={index}>
                  <button role="listitem" title={place.title} key={index} name={place.title} tabIndex="0" className="menu-item" onClick={(event) => clickedItem(place)}>
                    {place.title}
                  </button>
                </div>))
              }
            </div>
          </Menu>
        </div>
      </header>
      <main>
        <section id='map-container'>
          <Map title="google maps" role="application" className='map' style={style} initialCenter={initialCenter} google={google} zoom={zoom} onClick={onMapClicked}>
            {showingPlaces.map((place, index) => (<Marker className='marker' title={place.title} key={index} name={place.title} position={place.location} animation={google.maps.Animation.DROP} onClick={(event) => clickedMarker(place)}/>))}
            <InfoWindow position={markerPosition} visible={showingInfoWindow} onClose={this.windowHasClosed}>
              <span className="markerInformation">
                {markerInformation.map((info, index) => (<li key={index} className='InfoWindow-item'>{info}</li>))}
              </span>
            </InfoWindow>
          </Map>
        </section>
      </main>
    </div>);
  }
}

const LoadingContainer = (props) => (
  <div>Loading..</div>
);

export default GoogleApiWrapper({apiKey: ('AIzaSyDR8-7q8Qmz7jZ_mjRGtEiAuBYOlptzRvw'),
  LoadingContainer: LoadingContainer})(MapContainer);
