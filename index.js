// /** @format */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
import axios from "axios";
import APP_CONFIG from "./Config/config";


import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
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
      

    };
    this.getLocationsList = this.getLocationsList.bind(this);

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
        <Button
          onPress={this.getLocationsList}
          title={'Get Locations'}
        />
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

AppRegistry.registerComponent('PnlClientMobile', () => PnlClientMobile);
