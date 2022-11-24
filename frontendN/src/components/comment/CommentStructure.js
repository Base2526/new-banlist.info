import React, { useContext, useState } from 'react'
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar'
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";

import { ActionContext } from './ActionContext'

import { gqlUser } from "../../gqlQuery"
import _ from 'lodash';

const useStyles = makeStyles({
  link: {
    // color: 'white',
    position: 'relative',
    "&:hover:not(.Mui-disabled)": {
      cursor: "pointer",
      border: "none",
      color: "gray"
    },
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '2px',
      bottom: '-3px',
      left: '50%',
      transform: 'translate(-50%,0%)',
      // backgroundColor: 'red',
      visibility: 'hidden',
      transition: 'all 0.3s ease-in-out',
    },
    '&:hover:before': {
      visibility: 'visible',
      width: '100%',
    },
  },
});

const CommentStructure = (props) => {
  let { i, reply, parentId } = props

  

  const classes = useStyles();

  const actions = useContext(ActionContext)
  const edit = true

  const [anchorEl, setAnchorEl] = useState(null);

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (event, reason) => {
    setOpenDialog(false);
  };

  const handleAnchorOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAnchorClose = (event) => {
    setAnchorEl(null);
  };

  const dialogDelete = () =>{
    return  <Dialog
              open={openDialog}
              // onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Comment
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Delete your comment permanently?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {/* <Button  variant="outlined" onClick={()=>{
                  handleCloseDialog()
                  actions.onDelete(i.comId, parentId)
                }} autoFocus>
                  Delete
                </Button> */}

                <Button variant="outlined"  onClick={()=>{
                  handleCloseDialog()
                  actions.onDelete(i.comId, parentId)
                }} startIcon={<DeleteIcon />}>
                  Delete
                </Button>
                <Button variant="contained" onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </Dialog>
  }

  const onProfile = () =>{
    let userValue = useQuery(gqlUser, {
      variables: {id: i.userId},
      notifyOnNetworkStatusChange: true,
    });
  
    console.log("CommentStructure > userValue :", userValue)

    if(!userValue.loading){
      if(userValue.data.user.data == null){
        return  <div>
                  <Avatar className={classes.link} src={""} sx={{ width: 24, height: 24 }} alt="userIcon" />
                  <Typography className={classes.link} variant="subtitle2" gutterBottom component="div"></Typography>
                </div>
      }

      let {displayName, image}  = userValue.data.user.data

      return  <div>
                <Avatar className={classes.link} src={_.isEmpty(image[0]) ? "" : image[0].url} sx={{ width: 24, height: 24 }} alt="userIcon" />
                <Typography className={classes.link} variant="subtitle2" gutterBottom component="div">{displayName}</Typography>
              </div>
    }
    return  <div>
              <Avatar className={classes.link} src={""} sx={{ width: 24, height: 24 }} alt="userIcon" />
              <Typography className={classes.link} variant="subtitle2" gutterBottom component="div"></Typography>
            </div>
  }

  return (
    <div className={"halfDiv"}>
      <div className={"userInfo"} style={reply && { marginLeft: 15, marginTop: '6px' }} >
        <div className={"commentsTwo"}>
          {onProfile()}
          {
            actions.user 
            ? <div>
                <IconButton aria-label="reply" className={"replyBtn"}
                  onClick={() => actions.handleAction(i.comId)}
                  disabled={!actions.user}>
                  <ReplyIcon/>Reply
                </IconButton>
                <Typography variant="subtitle2" gutterBottom component="div">{moment.unix(i.updated / 1000).fromNow()}</Typography>
              </div>
            : <div />
          }
          
        </div>
        {/* <Typography variant="subtitle1" gutterBottom component="div">{i.text} </Typography> */}

        <Typography 
          variant="subtitle1" 
          gutterBottom 
          component="div"
          dangerouslySetInnerHTML={{ __html: i.text }}/>
      </div>
      <div className={"userActions"}>
        {actions.userId === i.userId && actions.user && (
           <IconButton aria-label="share">
           <MoreVertIcon
             onClick={handleAnchorOpen}
           />
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={
                Boolean(anchorEl)
              }
              onClose={handleAnchorClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
              MenuListProps={{
                "aria-labelledby": "lock-button",
                role: "listbox"
              }}
            >
              <MenuItem onClick={()=>{
                actions.handleAction(i.comId, edit)
                handleAnchorClose()
              }}>
                Edit
              </MenuItem>
              <MenuItem onClick={(ev)=>{
                // actions.handleAction(i.comId, edit)
                handleClickOpenDialog(ev)
                handleAnchorClose()
              }}>
                Delete
              </MenuItem>
            </Menu>
            
            {dialogDelete()}
           </IconButton>
        )}
      </div>
    </div>
  )
}

export default CommentStructure
