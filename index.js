// /** @format */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Auth0 from 'react-native-auth0';

var credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);


 export default class PnlClientMobile extends Component {
   
  constructor(props) {
    super(props);
    this.state = { 
      accessToken: null, 
      currentUser: "",
      locations: [],
      doors: [],
      favorites: [],
      currentPage: "locations",
      showLocations: true,
      loggedIn: false

    };
    // this.onHandleBottomNavLocationsClick = this.onHandleBottomNavLocationsClick.bind(
    //   this
    // );
  
    // this.onHandleBottomNavFavoritesClick = this.onHandleBottomNavFavoritesClick.bind(
    //   this
    // );
    // this.handleBottonNavSignOutClick = this.handleBottonNavSignOutClick.bind(
    //   this
    // );
    // this.getLocationsList = this.getLocationsList.bind(this);
    // this.showDoors = this.showDoors.bind(this);
    // this.onDoorClick = this.onDoorClick.bind(this);
    // this.logout = this.logout.bind(this);
  }
  



// getLocationsList() {
//   const { getIdToken } = this.props.auth;
//   const headers = { authorization: `Bearer ${getIdToken()}` };

//   axios
//     .get(APP_CONFIG.server_base_url + "client/doors", { headers })
//     .then(res => {
//       console.log(res);
//       this.setState({ locations: res.data.locations });
//     })
//     .catch(err => console.log(err));
// }

// componentDidMount() {
//   this.getLocationsList();
// }

// onDoorClick(id) {
//   const { getIdToken } = this.props.auth;
//   const headers = { authorization: `Bearer ${getIdToken()}` };

//   axios
//     .get(APP_CONFIG.server_base_url + "client/open?Id=" + id, {
//       headers
//     })
//     .then(res => console.log(res))
//     .catch(err => console.log(err));
// }

// onHandleBottomNavLocationsClick() {
//   this.setState({ currentPage: "locations" });
//   this.setState({ showLocations: true });
//   console.log(this.state.currentPage);
// }

// onHandleBottomNavFavoritesClick() {
//   this.setState({ currentPage: "favorites" });
//   console.log(this.state.currentPage);
// }

// handleBottonNavSignOutClick() {
//   this.setState({ currentPage: "signout" });
//   console.log(this.state.currentPage);
// }

// logout() {
//   this.props.auth.logout();
// }

// showDoors() {
//   this.setState({ showLocations: false });
// }


  _onLogin = () => {

    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
        audience: 'https://' + credentials.domain + '/userinfo',
      })
      
      .then(credentials => {
        this.setState({ accessToken: credentials.accessToken });
        console.log("authorized")
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
