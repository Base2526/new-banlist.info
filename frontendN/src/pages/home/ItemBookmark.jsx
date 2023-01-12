import React, { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import { useQuery } from "@apollo/client";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import _ from "lodash"
import { connect } from "react-redux";

import { gqlIsBookmark, subBookmark } from "../../gqlQuery"
import { getHeaders } from "../../util"

let unsubscribe =null
const ItemBookmark = (props) => {
  let {user, item, onDialogLogin, onBookmark} = props 

  
  let bmValus = useQuery(gqlIsBookmark, {
    context: { headers: getHeaders() }, 
    variables: { postId: ""},
    notifyOnNetworkStatusChange: true,
  });

  useEffect(()=>{
    bmValus.refetch({ postId: item._id});
  }, [user])

  
  if(!bmValus.loading){


    if(!_.isEmpty(bmValus.data)){

      let {subscribeToMore} = bmValus
      unsubscribe =  subscribeToMore({
        document: subBookmark,
        variables: { postId: item._id },
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) return prev;
  
          let { mutation, data } = subscriptionData.data.subBookmark;
  
          let newPrev = {...prev.isBookmark, data}
  
          return {isBookmark: newPrev};
        }
      });
      
      
      if(bmValus.data.isBookmark == null || bmValus.data.isBookmark.data ==null ){
        return  <IconButton onClick={(e) =>{
                  _.isEmpty(user) ?  onDialogLogin(true) :  onBookmark( item._id, true )
                }}>
                  <BookmarkIcon style={{ color:"" }} /> 
                </IconButton>
      }

      let isBookmark = bmValus.data.isBookmark.data  
      let color = isBookmark.status == null ? "" : isBookmark.status ? "blue" : ""
  
      return  <IconButton onClick={(e) =>{
                _.isEmpty(user) ?  onDialogLogin(true) : onBookmark( item._id, !isBookmark.status)
              }}>
                <BookmarkIcon style={{ color }} /> 
              </IconButton>
    }       
  }
  return  <IconButton onClick={(e) =>{
              _.isEmpty(user) ?  onDialogLogin(true) : onBookmark( item._id, true)
            }}> 
            <BookmarkIcon style={{ color:"" }} />
          </IconButton>

};

// export default ItemBookmark;

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
};

export default connect( mapStateToProps, null )(ItemBookmark);
