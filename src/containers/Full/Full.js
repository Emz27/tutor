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
import {Contracts as TutorContracts} from '../../views/Tutor/Contracts.js';
import {Subjects as TutorSubjects} from '../../views/Tutor/Subjects.js';
import {Ratings as TutorRatings} from '../../views/Tutor/Ratings.js';

import {FindTutor} from '../../views/Student/FindTutor.js';
import {Schedule as StudentSchedule} from '../../views/Student/Schedule.js';
import {Contracts as StudentContracts} from '../../views/Student/Contracts.js';

import Notifications from 'react-notify-toast';

class Full extends Component {

  render() {
    return (
      <div className="app">
        <Notifications options={{zIndex: 5000}} />
        <Header user={this.props.user}/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid className="p-0 p-md-3">
              {
                (this.props.user.type === 'Tutor')?
                <Switch>
                  <Route path="/profile" name="Profile" render={()=><TutorProfile user={this.props.user}/>}/>
                  <Route path="/schedule" name="Schedule" render={()=><TutorSchedule user={this.props.user}/>}/>
                  <Route path="/subjects" name="Subjects" render={()=><TutorSubjects user={this.props.user}/>}/>
                  <Route path="/contracts" name="Contracts" render={()=><TutorContracts user={this.props.user}/>}/>
                  <Route path="/ratings" name="Ratings" render={()=><TutorRatings user={this.props.user}/>}/>
                  <Redirect from="/" to="/profile"/>
                </Switch>
                :
                <Switch>
                  <Route path="/find_tutor" name="Find Tutor" render={()=><FindTutor user={this.props.user}/>}/>
                  <Route path="/schedule" name="Schedule" render={()=><StudentSchedule user={this.props.user}/>}/>
                  <Route path="/contracts" name="Agreements" render={()=><StudentContracts user={this.props.user}/>}/>
                  <Redirect from="/" to="/find_tutor"/>
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
