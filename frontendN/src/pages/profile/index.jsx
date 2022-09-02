import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';

import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);

import { logout } from "../../redux/actions/auth"

import { gqlUser ,gqlUpdateUser } from "../../gqlQuery"

const index = (props) => {
  let history = useHistory();
  let inputFile = useRef(null) 

  const [fileProfile, setFileProfile] = useState(null);

  const client = useApolloClient();

  const [onUpdateUser, resultUpdateUser] = useMutation(gqlUpdateUser, 
    {
      update: (cache, {data: {updateUser}}) => {
        // let {state} = history.location

        console.log("onUpdateUser :", updateUser )
        /*
        const data1 = cache.readQuery({
          query: gqlPost,
          variables: {id}
        });

        let newPost = {...data1.post}
        newPost = {...newPost, data: updatePost}

        cache.writeQuery({
          query: gqlPost,
          data: { post: newPost },
          variables: {id}
        });
        */
      },
      context: {
        headers: {
          'apollo-require-preflight': true,
        },
      },
      onCompleted({ data }) {}
    }
  );
  console.log("resultUpdateUser :", resultUpdateUser)

  let {logout} = props

  let user = props.user;//checkAuth()

  let useUser = useQuery(gqlUser, { variables: {id: user._id}, notifyOnNetworkStatusChange: true });
  if(useUser.loading || useUser.data.user == null){
    return <div><CircularProgress /></div> 
  }

  // console.log("useUser.data :", useUser.data, user)

  // if( useUser.data.user == null){
  //   return <div><CircularProgress /></div> 
  // }

  //  if(useUser.data.user.data == null){

  let currentUser = useUser.data.user.data;

  console.log("currentUser :", currentUser)

  let imageSrc =  _.isEmpty(currentUser.image) ? "" : currentUser.image[0].url

  const onChangeFile = (event) =>{
    event.stopPropagation();
    event.preventDefault();

    setFileProfile(event.target.files[0])
  }

  return (
    <div>
      <div>Profiles</div>

      <Stack direction="row" spacing={2}>
        <input type='file' id='file' ref={inputFile} style={{display: 'none'}}  onChange={onChangeFile} />
        <div style={{ position: "relative" }} >
          <Avatar
            className={"user-profile"}
            sx={{
              height: 80,
              width: 80
            }}
            variant="rounded"
            alt="Example Alt"
            src={ fileProfile === null ? imageSrc : URL.createObjectURL(fileProfile)}
          />
          <IconButton
            style={{
              position: "absolute",
              right: 0,
              bottom: 0
            }}
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => {
              // let newInputList = [
              //   ...inputList.slice(0, index),
              //   ...inputList.slice(index + 1, inputList.length)
              // ];

              // setInputList(newInputList);
              // onSnackbar({open:true, message:"Delete image"});

              inputFile.current.click();
            }}
          ><PhotoCamera /></IconButton>
        </div>
      </Stack>

      <Typography variant="overline" display="block" gutterBottom>
        Name : {currentUser.displayName}
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        Email : {currentUser.email}
      </Typography>

      <Button type="submit" variant="contained" color="primary" onClick={async() => { 
        console.log("UPDATE :", user)
        
        let newInput = currentUser
        if(fileProfile !== null){
          newInput = {...newInput, files: fileProfile}
        }

        console.log("onUpdateUser :", newInput)

        onUpdateUser({ variables: { id: newInput._id, input: newInput }});
        
      }}> UPDATE </Button>


      <Button onClick={async() => { 
        logout()
        // logout(); 
        // window.location.reload(false)

        await client.refetchQueries({
          include: "all", // Consider using "active" instead!
        });

        // history.push("/")
        window.location.reload();

        history.push("/")
      }}>Logout</Button>
    </div>
  );
};

// export default index;

const mapStateToProps = (state, ownProps) => {
  console.log("mapStateToProps  :", state)
  return {
    user: state.auth.user,
  }
};

const mapDispatchToProps = {
  logout
}

export default connect( mapStateToProps, mapDispatchToProps )(index);
