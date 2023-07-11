import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { listPublished } from '../group/api-group'
import { listEnrolled, listCompleted } from './../enrollment/api-enrollment'
import Typography from '@material-ui/core/Typography'
import auth from './../auth/auth-helper'
import Enrollments from '../enrollment/Enrollments'
import { join } from '../enrollment/api-enrollment'
import Groups from '../group/Groups'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    width: '90%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: '#ffffff'
  },
  extraTop: {
    marginTop: theme.spacing(12)
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
  },
  media: {
    minHeight: 400
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  image: {
    height: '100%'
  },
  tileBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
  enrolledTitle: {
    color: '#efefef',
    marginBottom: 5
  },
  action: {
    margin: '0 10px'
  },
  enrolledCard: {
    backgroundColor: '#616161',
  },
  divider: {
    marginBottom: 16,
    backgroundColor: 'rgb(157, 157, 157)'
  },
  noTitle: {
    color: 'lightgrey',
    marginBottom: 12,
    marginLeft: 8
  },
  aboutHeader: {
    textAlign: 'center',
    marginBottom: 20
  },
  about: {
    fontSize: 20,
    justifyContent: 'center',
    padding: 20,
  },
  groupCard: {
    // backgroundColor: '#616161',
    width: '90%',
    margin: 'auto',
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20
  },
  groupCode: {
    marginBottom: 20,
    color: 'orange',
    textAlign: 'center',
    fontSize: 20,
  },
  groupBody: {
    marginBottom: 20,
    padding: 20
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}))

export default function Home() {
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [groups, setGroups] = useState([])
  const [enrolled, setEnrolled] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listEnrolled({ t: jwt.token }, signal).then((data) => {
      if(!data){
        abortController.abort()
      }
      else if (data.error) {
        console.log(data.error)
      } else {
        setEnrolled(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listPublished(signal).then((data) => {
      if(!(data))
        abortController.abort()
      else if (data.error) {
        console.log(data.error)
      } else {
        setGroups(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const [UserGroupCode, setUserGroupCode] = useState('');
  const [values, setValues] = useState({
    code: '',

  })
  const handleCodeChange = (event) => {
    setUserGroupCode(event.target.value);
  }

  const handleGroupCode = () => {
    if(UserGroupCode.length != 6)
    {
      setValues({ ...values, error: "Please enter a correct code" })
      return;
    }
    join({ code: UserGroupCode }, { t: jwt.token }).then((data) => {
      if (!data) {
        console.log("Invalid Code")
        setValues({ ...values, error: "Invalid Code" })
      }
      else if (data.error) {
        console.log(data.error)
        setValues({ ...values, error: data.error })
      }
      else {
        console.log('then');
        setValues({ ...values, enrollmentId: data._id, redirect: true })
      }
    }
    )
  }
  if(values.redirect){
    console.log('redirect');
    return <Redirect to={'/learn/'+values.enrollmentId}/>
  }

  return (<div className={classes.extraTop}>
    {auth.isAuthenticated().user && !(auth.isAuthenticated().user.educator) && (
      <Card className={`${classes.card} ${classes.enrolledCard}`}>
        <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
          Groups you have joined
        </Typography>
        {enrolled.length != 0 ? (<Enrollments enrollments={enrolled} />)
          : (<Typography variant="body1" className={classes.noTitle}>No groups.</Typography>)
        }
      </Card>
    )}

    {/* Group Code entry if user is authenticated and isnt an educator */}

    {auth.isAuthenticated().user && !(auth.isAuthenticated().user.educator) && (
      <Card className={`${classes.groupCard} ${classes.groupCode}`}>
        <Typography variant="h6" className={classes.groupCode}>
          Enter a group code to join
        </Typography>

        <TextField variant="outlined" margin="normal" fullWidth id="groupCode" name="groupCode"
          autoComplete="groupCode" autoFocus value={UserGroupCode} onChange={handleCodeChange} />

        <CardActions>
          <Button color="primary" variant="contained" onClick={handleGroupCode} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
    )}

    {/* <Card className={classes.card}>
        <Typography variant="h5" component="h2">
            All Groups
        </Typography>
        {(groups.length != 0 && groups.length != enrolled.length) ? (<Groups groups={groups} common={enrolled}/>) 
                             : (<Typography variant="body1" className={classes.noTitle}>No new groups.</Typography>)
        }
      </Card> */}
    {!auth.isAuthenticated().user && (
      <Card className={classes.card}>
        <Typography variant="h3" component="h2" className={classes.aboutHeader}>
          About Us
        </Typography>
        <Typography variant="body1" component="h2" className={classes.about}>
          RISC is a web application designed to help students and instructors with cybersecurity training. It generates random, insecure containers that can be used to practice detecting and fixing vulnerabilities. The application is built using the MERN stack, with the database hosted on MongoDB Atlas and the application deployed on Google Cloud Platform. It uses Docker to containerize the application, and Docker Swarm to load balance across multiple spot VMs for cost-efficiency.
        </Typography>
        <Typography variant="body1" component="h2" className={classes.about}>
          Currently, the RISC prototype is capable of generating containers from a config file. It is hosted on Google Cloud Platform and accessible to the public. In the spring semester of 2023, it will be tested by students and instructors at PES University as part of their Computer Science and Engineering course curriculum.
        </Typography>
        <Typography variant="body1" component="h2" className={classes.about}>
          The application features a custom algorithm that generates containers based on configurable parameters. Both students and instructors can use RISC to generate and manage their own containers, with instructors able to assign containers to students as well. Overall, RISC aims to provide an easy-to-use and understand tool for cybersecurity training and practice.
        </Typography>
      </Card>
    )}
    { auth.isAuthenticated().user && auth.isAuthenticated().user.educator && (
      <Redirect to={"/teach/groups"} /> 
    )}
  </div>
  )
}

