import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { POS_KEY } from "../Constants";
import { AroundMarker } from "./AroundMarker";


class AroundMap extends React.Component {
  reLoadMarkers = () => {
    const center = this.map.getCenter();
    const position = { lat: center.lat(), lon: center.lng() };
    this.props.loadNearbyPosts(position, this.getRange());
  }
  getRange = () => {
    const google = window.google;
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    if (center && bounds) {
      const ne = bounds.getNorthEast();
      const right = new google.maps.LatLng(center.lat(), ne.lng());
      return 0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
    }
  }
  getMapRef = (map) => {
    this.map = map;
  }
  render() {
    const pos = JSON.parse(localStorage.getItem(POS_KEY));
    return (
      <GoogleMap
        onDragEnd={this.reLoadMarkers}
        onZoomChanged={this.reLoadMarkers}
        ref={this.getMapRef}
        defaultZoom={11}
        defaultCenter={{ lat: pos.lat, lng: pos.lon }}
        defaultOptions={{ scaleControl: true }}
      >
        {this.props.posts ? this.props.posts.map((post, index) =>
          <AroundMarker
            position={{lat: post.location.lat, lng: post.location.lon}}
            key={`${index}-${post.user}-${post.url}`}
            post={post}
          />
        ) : null}
      </GoogleMap>
    );
  }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));