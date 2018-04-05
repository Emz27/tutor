import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom';

// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss';
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss';

import * as firebase from 'firebase';
import 'firebase/firestore';

import {Portal} from './Portal.js';



var config = {
  apiKey: 'AIzaSyBHfBkVmx6VRKRBZuD--i3ucVf86Xo2PKk',
  authDomain: 'idyllic-catfish-183908.firebaseapp.com',
  databaseURL: 'https://idyllic-catfish-183908.firebaseio.com',
  projectId: 'idyllic-catfish-183908',
  storageBucket: 'idyllic-catfish-183908.appspot.com',
  messagingSenderId: '821372980104'
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {

  var userRecord = {};
  if (user) {
    console.log(user.email);

    firebase.firestore().collection('users').doc(user.uid).get().then(function(doc) {
      if (doc.exists) {
        userRecord = {
          ...doc.data(),
          id: doc.id
        };
        ReactDOM.render(
          <Router>
            <Portal user={userRecord}/>
          </Router>
          ,document.getElementById('root'));
      } else {
        firebase.firestore().auth().signOut();
        console.log('No such document!');
      }
    }).catch(function(error) {
      console.log('Error getting document:', error);
    });

  }
  else {
    ReactDOM.render(
      <Router>
        <Portal user={userRecord} />
      </Router>
      ,document.getElementById('root'));
  }


});
