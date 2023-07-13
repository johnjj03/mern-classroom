import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Add from '@material-ui/icons/AddBox'
import { makeStyles } from '@material-ui/core/styles'
import { newLab } from '../group/api-group'
import auth from '../auth/auth-helper'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { useEffect } from 'react'
import {getLabs} from './api-lab.js'

const useStyles = makeStyles(theme => ({
  form: {
    minWidth: 500
  }
}))

export default function NewLab(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [labs,setLabs] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const jwt = auth.isAuthenticated()

  const [values, setValues] = useState({
    title: '',
    content: '',
    lab : ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal 

    getLabs({
      userId: jwt.user._id
    },
    {t: jwt.token},signal).then((data) => {
      if(!(data) || (data.error))
        console.log("No Labs")
      else 
        setLabs(data)
    })
    return function cleanup() {
      abortController.abort()
    }
  },[])


  const clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const lab = {
      title: values.title || undefined,
      content: values.content || undefined,
      lab : selectedOption || undefined
    }
    newLab({
      groupId: props.groupId
    }, {
      t: jwt.token
    }, lab).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        props.addLab(data)
        setValues({
          ...values, title: '',
          content: '',
          lab: ''
        })
        setOpen(false)
      }
    })
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button aria-label="Add Lab" color="primary" variant="contained" onClick={handleClickOpen}>
        <Add /> &nbsp; New Lab
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <div className={classes.form}>
          <DialogTitle id="form-dialog-title">Add New Lab</DialogTitle>
          <DialogContent>

            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={values.title} onChange={handleChange('title')}
            /><br />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              multiline
              fullWidth
              value={values.content} onChange={handleChange('content')}
            /><br />
            {/* <TextField
            margin="dense"
            label="Resource link"
            type="text"
            fullWidth
            value={values.resource_url} onChange={handleChange('resource_url')}
          /> */}
            <FormControl fullWidth>
              <InputLabel>Labs</InputLabel>
              <Select value={selectedOption} onChange={handleOptionChange}>
                {labs.map(lab => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {lab.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br/>

          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={clickSubmit} color="secondary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}
NewLab.propTypes = {
  groupId: PropTypes.string.isRequired,
  addLab: PropTypes.func.isRequired
}