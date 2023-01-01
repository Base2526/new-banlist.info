import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useHistory } from "react-router-dom";
import DialogActions from '@mui/material/DialogActions';
import _ from "lodash"
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@material-ui/core/Typography";

import { gqlBasicContent } from "./gqlQuery"
import { getHeaders } from "./util"

const DialogTermsAndConditions = (props) => {
  let history = useHistory();
  let { open, onOK } = props

  // console.log("DialogTermsAndConditions")

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

  const basicContentValue = useQuery(gqlBasicContent, {
    context: { headers: getHeaders() },
    variables: {id: "631cb30fcc23758543a59ab8"},
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Dialog 
      fullWidth
      maxWidth="sm"
      scroll={"body"}
      onClose={(e)=>{
        // onClose(false)
        
      }} 
      open={open}>
      <DialogTitle>Terms and conditions</DialogTitle>
      <DialogContent>
      {
          basicContentValue.loading
          ? <CircularProgress />
          : <Typography dangerouslySetInnerHTML={{ __html: basicContentValue.data.basicContent.data.description }} />
      }
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