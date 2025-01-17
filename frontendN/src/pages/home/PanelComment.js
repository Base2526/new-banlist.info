import React, { useState, useEffect, withStyles } from "react";
import { CommentSection } from "../../components/comment";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useMutation } from "@apollo/client";

import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);

import { gqlComment, gqlCreateAndUpdateComment, subComment} from "../../gqlQuery"
import { getHeaders } from "../../util"

const styles = {
  largeIcon: {
    width: 60,
    height: 60
  }
};

const useStyles = makeStyles((theme) => ({
  deleteIcon1: {
    "& svg": {
      fontSize: 25
    }
  },
  deleteIcon2: {
    "& svg": {
      fontSize: 50
    }
  },
  deleteIcon3: {
    "& svg": {
      fontSize: 75
    }
  },
  deleteIcon4: {
    "& svg": {
      fontSize: 100
    }
  }
}));

const PanelComment = (props) => {
  const classes = useStyles();

  let { user, commentId, isOpen, onRequestClose, onSignin } = props

  console.log("props :", props)

  // const [comment, setComment] = useState([]);
  const userId =  user == null ? "" : user._id;
  // const avatarUrl = user == null ? "" : _.isEmpty(user.image) ? "" : user.image[0].url ;
  // const name = user == null ? "" : user.displayName;
  const signinUrl = "/signin";
  const signupUrl = "/signup";
  let count = 0;

  const [onCreateAndUpdateComment, resultCreateAndUpdateComment] = useMutation(gqlCreateAndUpdateComment, {
    context: { headers: getHeaders() }, 
    update: (cache, {data: {createAndUpdateComment}}) => {
        const data1 = cache.readQuery({
            query: gqlComment,
            variables: {postId: commentId}
        });

        let newData = {...data1.comment}
        newData = {...newData, data: createAndUpdateComment.data}
            
        cache.writeQuery({
            query: gqlComment,
            data: {
                comment: newData
            },
            variables: {
                postId: commentId
            }
        });
    },
    onCompleted({ data }) {
        console.log("onCompleted")
    }
  });
  console.log("resultCreateAndUpdateComment :", resultCreateAndUpdateComment)

  let commentValues = useQuery(gqlComment, {
    context: { headers: getHeaders() }, 
    variables: {postId: commentId},
    notifyOnNetworkStatusChange: true,
  });
  console.log("commentValues : ", commentValues, commentId)
  if(!commentValues.loading){
    let {subscribeToMore} = commentValues
    const unsubscribe =  subscribeToMore({
			document: subComment,
      variables: { commentID: commentId },
			updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;

				// console.log("updateQuery >> ", prev, subscriptionData);

        let { mutation, data } = subscriptionData.data.subComment;

        let newPrev = {...prev.comment, data}
  
        return {comment: newPrev}; //;
			}
		});

    // console.log("unsubscribe :", unsubscribe)
  }

  // if(!commentValues.loading){
  //   setComment(commentValues.data.Comment.data)
  // }

  return (
    <SwipeableDrawer
      anchor={"right"}
      open={isOpen}
      // onClose={onRequestClose}
      // onOpen={onRequestClose}
      ModalProps={{ onBackdropClick: onRequestClose }}
    >
      <Box
        sx={{
          width: 400
        }}
        role="presentation"
        // onClick={onRequestClose}
        // onKeyDown={onRequestClose}
      >
        <IconButton
          className="panel-comment-button-close"
          aria-label="toggle password visibility"
          onClick={onRequestClose}
        >
          <CloseIcon />
        </IconButton>
        <div className="commentSection">
          {
            commentValues.loading 
            ? <div><CircularProgress /></div> 
            : <div>
                <CommentSection
                  currentUser={
                    userId && { userId: userId /*, avatarUrl: avatarUrl, name: name */ }
                  }
                  commentsArray={commentValues.data.comment.data}
                  setComment={(data) => {
                    let input = { postId: commentId, data: _.omitDeep(data, ['__typename']) }
                    onCreateAndUpdateComment({ variables: { input }});
                  }}
                  signinUrl={signinUrl}
                  signupUrl={signupUrl}
                  onSignin={(e)=>{
                    onSignin(e)
                  }}
                />
              </div>  
          }
        </div>
      </Box>
    </SwipeableDrawer>
  );
};

export default PanelComment;
