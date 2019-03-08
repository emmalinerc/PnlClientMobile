import axios from "axios";
import APP_CONFIG from "./Config/config";

import Locations from "./components/locations";
import React, { Component } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Auth0 from 'react-native-auth0';

var credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);


 export default class PnlClientMobile extends Component {
   
  constructor(props) {
    super(props);
    this.state = { 
      accessToken: null, 
      idToken: null,
      locations: [],
      

    };
    this.getLocationsList = this.getLocationsList.bind(this);
    this.onDoorClick = this.onDoorClick.bind(this);

  }

  _onLogin = () => {

    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
        audience: 'https://' + credentials.domain + '/userinfo',
      })
      
      .then(credentials => {
        this.setState({ accessToken: credentials.accessToken, idToken: credentials.idToken }, this.getLocationsList);
        console.log("creds", credentials)
      })
  };

  _onLogout = () => {
    if (Platform.OS === 'android') {
      this.setState({ accessToken: null });
    } else {
      auth0.webAuth
        .clearSession({})
        .then(success => {
          this.setState({ accessToken: null });
        })
        .catch(error => console.log(error));
    }
  };

  onDoorClick(id) {
    const headers = { authorization: `Bearer ${this.state.idToken}` };

    axios
      .get("https://localhost:5001/api/client/open?Id=" + id, { headers })
      .then(res => {
        console.log("I am Clicked!!!! Look at me!!!!")
        console.log(res);
      })
      .catch(err => console.log(err));
  }


  getLocationsList() {
    const headers = { authorization: `Bearer ${this.state.idToken}` };

    axios
      .get("http://localhost:5000/api/client/doors", { headers })
      .then(res => {
        console.log(res);
        this.setState({ locations: res.data.locations });
        console.log("Locations: " + this.state.locations)
      })
      .catch(err => console.log(err));
  }
  

  render() {
    let loggedIn = this.state.accessToken === null ? false : true;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Pop N Lock</Text>
        <Text>
          You are {loggedIn ? '' : 'not '}logged in.
        </Text>
        <Button
          onPress={loggedIn ? this._onLogout : this._onLogin}
          title={loggedIn ? 'Log Out' : 'Log In'}
        />
        <Locations locations={this.state.locations} onDoorClick={this.onDoorClick}/>
        {/* <View>
          {this.state.locations.map((location, index) => {
            return (
              <View key={location.ID}>
                <Text>{location.Name}</Text>
              </View>
                 );
            })}
          </View> */}
      </View>
    );
  }
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
