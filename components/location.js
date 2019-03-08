import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  CheckBox,
} from 'react-native';
import axios from "axios";


export default class Location extends Component {
   
    constructor(props) {
      super(props);
      this.showDoors = this.showDoors.bind(this);
      this.toggleShowDoors = this.toggleShowDoors.bind(this);
      this.onDoorClick = this.onDoorClick.bind(this);
      this.state = { 
          showDoors: false,
          isChecked: false
        };   
    }

    onDoorClick(id) {
        const headers = { authorization: `Bearer ${this.state.idToken}` };
    
        axios
          .get("https://localhost:5001/api/client/open?Id=" + id, { headers })
          .then(res => {
            console.log(res);
          })
          .catch(err => console.log(err));
      }
    

      
    showDoors() {
        if (!this.state.showDoors){
            return
          }
          let list = 
          <View>
            {this.props.location.Raspi.map((raspi, index) => {
                return (
                    <View key={raspi.ID}>
    {                       raspi.Doors.map((door, index) => {
                            return (
                                <View key={door.ID} onPress={this.onDoorClick(door.ID)}>
                                    <Text> {door.Name} </Text>
                                </View>
                            );
                        })}
                    </View>
                );
             })}
        </View>;
        return list
    }
    toggleShowDoors() {
        this.setState({showDoors:!this.state.showDoors})
      }
       

    render() {
        return (
        <View>
        <Text onPress = {this.toggleShowDoors}>{this.props.location.Name}</Text>
        {this.showDoors()}
        </View>
        )
    }
}
