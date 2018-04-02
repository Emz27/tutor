import React, {Component} from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/Header.js';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import {Profile as TutorProfile} from '../../views/Tutor/Profile.js';
import {Schedule as TutorSchedule} from '../../views/Tutor/Schedule.js';
import {Schedule as TutorContracts} from '../../views/Tutor/Contracts.js';
import {Schedule as TutorSubjects} from '../../views/Tutor/Subjects.js';
import {Schedule as TutorRatings} from '../../views/Tutor/Ratings.js';

import {FindTutor} from '../../views/Student/FindTutor.js';
import {Profile as StudentProfile} from '../../views/Student/Profile.js';
import {Schedule as StudentSchedule} from '../../views/Student/Profile.js';
import {Contracts as StudentContracts} from '../../views/Student/Contracts.js';

class Full extends Component {
  constructor(props){
    super(props);

  }
  render() {
    return (
      <div className="app">
        <Header user={this.props.user}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              {
                (this.props.user.type === 'Tutor')?
                <Switch>
                  <Route path="/profile" name="Profile" component={TutorProfile}/>
                  <Route path="/schedule" name="Schedule" component={TutorSchedule}/>
                  <Route path="/subjects" name="Subjects" component={TutorSubjects}/>
                  <Route path="/contracts" name="Contracts" component={TutorContracts}/>
                  <Route path="/ratings" name="Ratings" component={TutorRatings}/>
                  <Redirect from="/" to="/profile"/>
                </Switch>
                :
                <Switch>
                  <Route path="/find_tutor" name="Find Tutor" component={FindTutor}/>
                  <Route path="/profile" name="Profile" component={StudentProfile}/>
                  <Route path="/schedule" name="Schedule" component={StudentSchedule}/>
                  <Route path="/contracts" name="Contracts" component={StudentContracts}/>
                  <Redirect from="/" to="/profile"/>
                </Switch>
              }
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
