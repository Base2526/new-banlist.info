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
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Box from "@mui/material/Box";

import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);

import { logout } from "../../redux/actions/auth"

import { gqlUser ,gqlUpdateUser } from "../../gqlQuery"

let initValues = { displayName: "",  files: null }

const index = (props) => {
  let history = useHistory();
  let inputFile = useRef(null) 

  let myForm = useRef();

  let {logout} = props

  let user = props.user;//checkAuth()

  const [fileProfile, setFileProfile] = useState(null);

  const [isUpdate, setIsUpdate] = useState(false);
  const [input, setInput]       = useState(initValues);
  const [error, setError]       = useState(initValues);

  const client = useApolloClient();

  const [onUpdateUser, resultUpdateUser] = useMutation(gqlUpdateUser, 
    {
      update: (cache, {data: {updateUser}}) => {
        // let {state} = history.location

        console.log("onUpdateUser :", updateUser, props)
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

  useEffect(()=>{
    setInput({...input, displayName: user.displayName })
  }, [])

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "displayName": {
          if (!value) {
            stateObj[name] = "Please enter display name.";
          }

          if(user.displayName != value){
            setIsUpdate(true)
          }else{
            setIsUpdate(false)
          }
          
          break;
        }

        default:
          break;
      }

      return stateObj;
    });
  };


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

    setInput({...input, files: event.target.files[0] })

    setIsUpdate(true)
  }

  const submitForm = async(event) => {
    event.preventDefault();
  
    console.log("myForm.current.buttonId > :", myForm.current.buttonId )

    // console.log(myForm.current);

    switch(myForm.current.buttonId){
      case "update":{
        onUpdateUser({ variables: { id: currentUser._id, input }});
        break;
      }

      case "logout":{
          logout()
          await client.refetchQueries({ include: "all" });
          window.location.reload();
          history.push("/")
        break;
      }
    }
  }

  return (
    <div className="page-profile pl-2 pr-2 mb-4">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "50ch" }
            }}
            ref={myForm}
            onSubmit={submitForm}>

          <div className="Mui-title">Profiles</div>

          <Stack direction="row" spacing={2} className="Mui-csswrapbox">
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}}  onChange={onChangeFile} />
            <div style={{ position: "relative" }} className="Mui-avatar" >
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

          <TextField
            id="post-name-subname"
            name="displayName"
            label="Display name"
            variant="filled"
            required
            value={input.displayName}
            onChange={onInputChange}
            onBlur={validateInput}
            helperText={error.displayName}
            error={_.isEmpty(error.displayName) ? false : true}
          />
          <Typography variant="overline" display="block" gutterBottom>
            Email : {currentUser.email}
          </Typography>
          <div className="d-flex Mui-wrapbtn">
            <Button disabled={!isUpdate} type="submit" variant="contained" color="primary" id="update"  onClick={ e => myForm.current.buttonId=e.target.id }>UPDATE</Button>
            <Button type="submit" variant="contained" color="primary" id="logout"  onClick={ e => myForm.current.buttonId=e.target.id }>Logout</Button>
          </div>
        </Box>
      </LocalizationProvider>
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
