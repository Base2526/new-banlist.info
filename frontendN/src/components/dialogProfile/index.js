import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Typography, makeStyles } from "@material-ui/core";
import CommentIcon from "@mui/icons-material/Comment";
import { useHistory } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import { useQuery, useMutation } from "@apollo/client";

import {gqlCreateConversation} from "../../gqlQuery"

const index =({open, id, onClose})=> {
  
  const navigate = useHistory();

  let userId= "62a2f65dcf7946010d3c7547";

  const [onCreateConversation, resultCreateConversation] = useMutation(gqlCreateConversation
    , {
        update: (cache, {data: {createConversation}}) => {
          // Update the cache as an approximation of server-side mutation effects
          console.log("update > createConversation", createConversation)
        },
        onCompleted({ data }) {
          // history.push("/");
          console.log("onCompleted > onCreateConversation")

          navigate.push("/message")
        },
      },  
  );
  

  return (
      <Dialog open={open}>
        <DialogTitle>Dialog Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Avatar>H</Avatar>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CLOSE</Button>
          <IconButton onClick={() => {
              onCreateConversation({ variables: { input: {
                    friendId: id
                  }
                }
              }); 
            }}>
              <CommentIcon />
            </IconButton>
        </DialogActions>
      </Dialog>
  );
}

export default index 