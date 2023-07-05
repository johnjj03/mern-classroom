import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import NewGroup from './group/NewGroup'
//import Groups from './group/Groups'
import Group from './group/Group'
import EditGroup from './group/EditGroup'
import MyGroups from './group/MyGroups'
import Enrollment from './enrollment/Enrollment'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signin" component={Signin}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route path="/user/:userId" component={Profile}/>
        <Route path="/group/:groupId" component={Group}/>
        <PrivateRoute path="/teach/groups" component={MyGroups}/>
        
        <PrivateRoute path="/teach/group/new" component={NewGroup}/>
        <PrivateRoute path="/teach/group/edit/:groupId" component={EditGroup}/>
        <PrivateRoute path="/teach/group/:groupId" component={Group}/>
        <PrivateRoute path="/learn/:enrollmentId" component={Enrollment}/>

      </Switch>
    </div>)
}

export default MainRouter
