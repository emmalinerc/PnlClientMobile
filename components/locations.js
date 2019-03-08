import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Location from "./location";

export default class Locations extends Component {
   
    constructor(props) {
      super(props);
      this.state = { 
        };
    }

    render() {
        return (
        <View>
        {this.props.locations.map((location, index) => {
            return (
                <View key={location.ID}>
                <Location location={location} onDoorClick={this.props.onDoorClick}/>
                </View>
            );
        })}
        </View>
        )
    }
}