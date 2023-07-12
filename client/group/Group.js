import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import PeopleIcon from '@material-ui/icons/Group'
import CompletedIcon from '@material-ui/icons/VerifiedUser'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import { read, update } from './api-group.js'
import { enrollmentStats, getStudents } from '../enrollment/api-enrollment.js'
import { Link, Redirect } from 'react-router-dom'
import auth from '../auth/auth-helper.js'
import DeleteGroup from './DeleteGroup.js'
import Divider from '@material-ui/core/Divider'
import NewLab from './NewLab.js'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Enroll from '../enrollment/Enroll.js'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 1200,
    margin: 'auto',
    marginLeft: 130,
    marginRight: 130,
    padding: theme.spacing(3),
    // marginTop: theme.spacing(12),
    marginTop: 35,
    display: 'flex'
  }),
  flex: {
    display: 'flex',
    marginBottom: 20
  },
  card: {
    padding: '24px 10px 30px',
    margin: '20px',
    maxWidth: 1500,
    marginRight: 60,
    paddingLeft: 50,
    paddingRight: 50,
  },
  studentCard: {
    paddingTop: 44,
    paddingBottom: 24,
    paddingRight: 50,
    paddingLeft: 40,
    // margin: '20px',
    marginTop: 20,
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  code: {
    color: theme.palette.openTitle,
    marginLeft: 200,
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 190,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  category: {
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5
  },
  action: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  statSpan: {
    margin: '7px 20px 0 10px',
    alignItems: 'center',
    color: '#616161',
    display: 'inline-flex',
    '& svg': {
      marginRight: 10,
      color: '#b6ab9a'
    }
  },
  enroll: {
    float: 'right'
  }
}))

export default function Group({ match }) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [group, setGroup] = useState({ instructor: {} })
  const [students, setStudents] = useState({ student: [] })
  const [values, setValues] = useState({
    redirect: false,
    error: ''
  })
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ groupId: match.params.groupId }, signal).then((data) => {
      if (!data)
        setValues({ ...values, error: "Group not found" })
      else if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setGroup(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.groupId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    enrollmentStats({ groupId: match.params.groupId }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setStats(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.groupId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    getStudents({ groupId: match.params.groupId }, { t: jwt.token }, signal).then((data) => {
      if (!(data))
        console.log("No data")
      else if (data.error) {
        setValues({ ...values, error: data.error })
      }
      else {
        setStudents(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.groupId])


  const removeGroup = (group) => {
    setValues({ ...values, redirect: true })
  }
  const addLab = (group) => {
    setGroup(group)
  }
  const clickPublish = () => {
    if (group.labs.length > 0) {
      setOpen(true)
    }
  }
  const publish = () => {
    let groupData = new FormData()
    groupData.append('published', true)
    update({
      groupId: match.params.groupId
    }, {
      t: jwt.token
    }, groupData).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setGroup({ ...group, published: true })
        setOpen(false)
      }
    })
  }
  const handleClose = () => {
    setOpen(false)
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/groups'} />)
  }
  const imageUrl = group._id
    ? `/api/groups/photo/${group._id}?${new Date().getTime()}`
    : '/api/groups/defaultphoto'

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center" alignItems="center">
      <Card className={classes.card}>
        <CardHeader
          title={group.name}
          subheader={<div>
            <Link to={"/user/" + group.instructor._id} className={classes.sub}>By {group.instructor.name}</Link>
            <span className={classes.category}>{group.category}</span>
          </div>
          }
          action={<>
            {auth.isAuthenticated().user && auth.isAuthenticated().user._id == group.instructor._id &&
              (<span className={classes.action}>
                <Link to={"/teach/group/edit/" + group._id}>
                  <IconButton aria-label="Edit" color="secondary">
                    <Edit />
                  </IconButton>
                </Link>
                {/* {!group.published ? (<>
                  <Button color="secondary" variant="outlined" onClick={clickPublish}>{group.labs.length == 0 ? "Add atleast 1 lab to publish" : "Publish"}</Button>
                </>) : (
                  <Button color="primary" variant="outlined">Published</Button>
                )} */}
                <DeleteGroup group={group} onRemove={removeGroup} />
              </span>)
            }
            <Typography variant="subtitle1" className={classes.code}>
              {group.code}
            </Typography>
            {!(group.published) && (<div>
              <span className={classes.statSpan}><PeopleIcon /> {stats.totalEnrolled} enrolled </span>
              <span className={classes.statSpan}><CompletedIcon /> {stats.totalCompleted} completed </span>
            </div>
            )}

          </>
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={group.name}
          />
          <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {group.description}<br />
            </Typography>

            {/* {group.published && !auth.isAuthenticated().user.instructor && 
              <div className={classes.enroll}><Enroll groupId={group._id}/></div>
              }  */}

          </div>
        </div>
        <Divider />
        <div>
          <CardHeader
            title={<Typography variant="h6" className={classes.subheading}>Labs</Typography>
            }
            subheader={<Typography variant="body1" className={classes.subheading}>{group.labs && group.labs.length} labs</Typography>}
            action={
              auth.isAuthenticated().user && auth.isAuthenticated().user._id == group.instructor._id &&
              (<span className={classes.action}>
                <NewLab groupId={group._id} addLab={addLab} />
              </span>)
            }
          />
          <List>
            {group.labs && group.labs.map((lab, index) => {
              return (<span key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={lab.title}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </span>)
            }
            )}
          </List>
        </div>
      </Card>
      {/* <Card className={classes.card}>
        <List>
          {students && Array.isArray(students) && students.map((student) => (
            <ListItem key={student._id}>
              <Link to={"/user/" + student._id}>
                <ListItemText primary={student.name} />
                <ListItem primary={student.email} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Card> */}

      <Card className={classes.studentCard}>
        <Grid container spacing={4}>
          {students && Array.isArray(students) && students.map((student) => (
            <React.Fragment key={student._id}>
              <Grid item xs={6}>
                <Typography variant="body1">{student.name}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{student.email}</Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        {students.length == 0 &&
          <Typography variant="body1">No students enrolled yet</Typography>}
      </Card>
      </Grid>
    </div>)
}
