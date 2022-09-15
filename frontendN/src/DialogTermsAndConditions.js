import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from '@mui/material/FormControlLabel';



import _ from "lodash"

import { login } from "./redux/actions/auth"
import { gqlFollower } from "./gqlQuery"

const DialogTermsAndConditions = (props) => {
  let history = useHistory();
  let { open, onOK } = props

  console.log("DialogTermsAndConditions")

  // let followerValues = useQuery(gqlFollower, {
  //   variables: {userId: id},
  //   notifyOnNetworkStatusChange: true,
  // });

  // const onSrc = (follower) =>{
  //   if(_.isEmpty(follower.image)){
  //     return ""
  //   }else{
  //     return follower.image[0].base64
  //   }
  // }

  return (
    <Dialog 
      fullWidth
      maxWidth="sm"
      onClose={(e)=>{
        // onClose(false)
        
      }} 
      open={open}>
      <DialogTitle>Terms and conditions</DialogTitle>
      <DialogContent>
       คำเตือน! ข้อมูลทั้งหมดนี้ เป็นข้อมูลเพื่อทดสอบระบบไม่สามารถนําไปอ้างอิงใดๆ ได้ทั้งสิ้น
      </DialogContent>
      <DialogActions>
        {/* <FormControlLabel
        control={<Checkbox checked={true} onChange={(event)=>{
          console.log(" >", event.target.checked)
        }} />}
        label="Aree" /> */}
        <Button onClick={()=>{
          console.log("Close")

          onOK()
        }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.auth.user,
//   }
// };
// const mapDispatchToProps = {
//   login
// }
// export default connect( mapStateToProps, mapDispatchToProps )(DialogFollower);

export default DialogTermsAndConditions;