import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'
import ArrowUp from '@material-ui/icons/ArrowUpward'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import {read, update} from './api-group.js'
import {Link, Redirect} from 'react-router-dom'
import auth from '../auth/auth-helper.js'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(12)
      }),
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  upArrow: {
      border: '2px solid #f57c00',
      marginLeft: 3,
      marginTop: 10,
      padding:4
 },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  media: {
    height: 250,
    display: 'inline-block',
    width: '50%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  textfield:{
    width: 350
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  list: {
    backgroundColor: '#f3f3f3'
  }
}))

export default function EditGroup ({match}) {
  const classes = useStyles()
  const [group, setGroup] = useState({
      name: '',
      description: '',
      image:'',
      category:'',
      instructor:{},
      labs: []
    })
  const [values, setValues] = useState({
      redirect: false,
      error: ''
    })
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({groupId: match.params.groupId}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          data.image = ''
          setGroup(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.groupId])
  const jwt = auth.isAuthenticated()
  const handleChange = name => event => {
    const value = name === 'image'
    ? event.target.files[0]
    : event.target.value
    setGroup({ ...group, [name]: value })
  }
  const handleLabChange = (name, index) => event => {
    const labs = group.labs
    labs[index][name] =  event.target.value
    setGroup({ ...group, labs: labs })
  }
  const deleteLab = index => event => {
    const labs = group.labs
    labs.splice(index, 1)
    setGroup({...group, labs:labs})
 }
  const moveUp = index => event => {
      const labs = group.labs
      const moveUp = labs[index]
      labs[index] = labs[index-1]
      labs[index-1] = moveUp
      setGroup({ ...group, labs: labs })
  }
  const clickSubmit = () => {
    let groupData = new FormData()
    group.name && groupData.append('name', group.name)
    group.description && groupData.append('description', group.description)
    group.image && groupData.append('image', group.image)
    group.category && groupData.append('category', group.category)
    groupData.append('labs', JSON.stringify(group.labs))
    update({
        groupId: match.params.groupId
      }, {
        t: jwt.token
      }, groupData).then((data) => {
        if (data && data.error) {
            console.log(data.error)
          setValues({...values, error: data.error})
        } else {
          setValues({...values, redirect: true})
        }
      })
  }
  if (values.redirect) {
    return (<Redirect to={'/teach/group/'+group._id}/>)
  }
    const imageUrl = group._id
          ? `/api/groups/photo/${group._id}?${new Date().getTime()}`
          : '/api/groups/defaultphoto'
    return (
        <div className={classes.root}>
              <Card className={classes.card}>
                <CardHeader
                  title={<TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={group.name} onChange={handleChange('name')}
                  />}
                  subheader={<div>
                        <Link to={"/user/"+group.instructor._id} className={classes.sub}>By {group.instructor.name}</Link>
                        {<TextField
                    margin="dense"
                    label="Category"
                    type="text"
                    fullWidth
                    value={group.category} onChange={handleChange('category')}
                  />}
                      </div>
                    }
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == group.instructor._id &&
                (<span className={classes.action}><Button variant="contained" color="secondary" onClick={clickSubmit}>Save</Button>
                    </span>)
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={group.name}
                  />
                  <div className={classes.details}>
                  <TextField
                    margin="dense"
                    multiline
                    rows="5"
                    label="Description"
                    type="text"
                    className={classes.textfield}
                    value={group.description} onChange={handleChange('description')}
                  /><br/><br/>
                  <input accept="image/*" onChange={handleChange('image')} className={classes.input} id="icon-button-file" type="file" />
                 <label htmlFor="icon-button-file">
                    <Button variant="outlined" color="secondary" component="span">
                    Change Photo
                    <FileUpload/>
                    </Button>
                </label> <span className={classes.filename}>{group.image ? group.image.name : ''}</span><br/>
                  </div>
                

          </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Labs - Edit and Rearrange</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{group.labs && group.labs.length} labs</Typography>}
                />
                <List>
                {group.labs && group.labs.map((lab, index) => {
                    return(<span key={index}>
                    <ListItem className={classes.list}>
                    <ListItemAvatar>
                        <>
                        <Avatar>
                        {index+1}
                        </Avatar>
                     { index != 0 &&     
                      <IconButton aria-label="up" color="primary" onClick={moveUp(index)} className={classes.upArrow}>
                        <ArrowUp />
                      </IconButton>
                     }
                    </>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<><TextField
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            value={lab.title} onChange={handleLabChange('title', index)}
                          /><br/>
                          <TextField
                          margin="dense"
                          multiline
                          rows="5"
                          label="Content"
                          type="text"
                          fullWidth
                          value={lab.content} onChange={handleLabChange('content', index)}
                        /><br/>
                        <TextField
            margin="dense"
            label="Resource link"
            type="text"
            fullWidth
            value={lab.resource_url} onChange={handleLabChange('resource_url', index)}
          /><br/></>}
                    />
                    {!group.published && <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="up" color="primary" onClick={deleteLab(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>}
                    </ListItem>
                    <Divider style={{backgroundColor:'rgb(106, 106, 106)'}} component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
              </Card>
        </div>)
}
