import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);

import {  gqlPost, gqlCreatePost, gqlUpdatePost, 
          gqlUser, gqlShareByPostId, gqlBookmarksByPostId,
          gqlPosts } from "../../gqlQuery"

import "../../translations/i18n";
import { getHeaders } from "../../util"
import Tabs from "../../components/tab/Tabs";
import Panel from "../../components/tab/Panel";
import BankInputField from "./BankInputField";
import AttackFileField from "./AttackFileField";
import TelInputField from "./TelInputField";
import PopupSnackbar from "../home/PopupSnackbar";
import Editor from "../../components/editor/Editor";

let editValues = undefined;
let bookmarksByPostIdValues = undefined;
let shareValues = undefined;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .editBtn {
    border: none;
    border-radius: 10px;
    padding: 3px 10px;
    background-color: #dbffee;
    color: #078f4e;
    cursor: pointer;
  }

  .deleteBtn {
    color: red;
    cursor: pointer;
  }
`;

let initValues = {
  title: "", 
  nameSubname: "", 
  idCard: "", 
  amount: "",
  tels: [],
  banks: [],
  description: "",
  dateTranfer: null,
  attackFiles: [] 
}

const bmColumns = [
  { 
    field: "userId", 
    headerName: "Username ccc", 
    width: 150,
    renderCell: (params) => {
      let value = useQuery(gqlUser, {
        context: { headers: getHeaders() },
        variables: { id: params.row.userId },
        notifyOnNetworkStatusChange: true,
      });

      console.log("Username : ", value)

      return  value.loading 
              ? <LinearProgress sx={{width:"100px"}} />
              : <Typography variant="overline" display="block" gutterBottom>
                  { value.data.user.data === null ? "" : value.data.user.data.displayName}
                </Typography>
      
    }
  },
  { 
    field: "postId", 
    headerName: "Post name", 
    width: 400, 
    renderCell: (params) => {
      let postValue = useQuery(gqlPost, {
        context: { headers: getHeaders() },
        variables: {id: params.row.postId},
        notifyOnNetworkStatusChange: true,
      });

      return  postValue.loading 
              ? <LinearProgress sx={{width:"100px"}} />
              : <Typography variant="overline" display="block" gutterBottom>
                  {postValue.data.post.data.title}
                </Typography>
      
    }
  },
  {
    field: "action",
    headerName: "Action",
    width: 140,
    renderCell: (params) => {
      return (
        <ButtonWrapper>
          <DeleteOutline
            className="deleteBtn"
            onClick={() => {
              setOpenDialogDelete({ isOpen: true, id: params.row._id });
            }}
          />
        </ButtonWrapper>
      );
    }
  }
];

const shcolumns = [
  { 
    field: "userId", 
    headerName: "Username", 
    width: 150,
    renderCell: (params) => {
      let value = useQuery(gqlUser, {
        context: { headers: getHeaders() },
        variables: {id: params.row.userId},
        notifyOnNetworkStatusChange: true,
      });

      return  value.loading 
              ? <LinearProgress sx={{width:"100px"}} />
              : <Typography variant="overline" display="block" gutterBottom>
                  {value.data.User.data.displayName}
                </Typography>
      
    }
  },
  { 
    field: "postId", 
    headerName: "Post name", 
    width: 400, 
    renderCell: (params) => {
      let postValue = useQuery(gqlPost, {
        context: { headers: getHeaders() },
        variables: {id: params.row.postId},
        notifyOnNetworkStatusChange: true,
      });

      return  postValue.loading 
              ? <LinearProgress sx={{width:"100px"}} />
              : <Typography variant="overline" display="block" gutterBottom>
                  {postValue.data.post.data.title}
                </Typography>
      
    }
  },
  { 
    field: "destination", 
    headerName: "Destination", 
    width: 100, 
    renderCell: (params) => {
      return  <Typography>
                {params.row.destination}
              </Typography>
    }
  },
  {
    field: "action",
    headerName: "Action",
    width: 140,
    renderCell: (params) => {
      return (
        <ButtonWrapper>
          <DeleteOutline
            className="deleteBtn"
            onClick={() => {
              setOpenDialogDelete({ isOpen: true, id: params.row._id });
            }}
          />
        </ButtonWrapper>
      );
    }
  }
];

const Post = (props) => {
  let history = useHistory();

  const { t } = useTranslation();

  // props.location.state
  console.log("props.location.state :", history)

  let {user} = props

  if(_.isEmpty(user)){
    history.push("/")
  }

  let { id, mode } = useParams();

  const [snackbar, setSnackbar] = useState({open:false, message:""});
  const [input, setInput]       = useState(initValues);
  const [error, setError]       = useState(initValues);

  const [bmPageOptions, setBmPageOptions] = useState([20, 100]);  
  const [bmPage, setBmPage] = useState(0);  
  const [bmPerPage, setBmPerPage] = useState(bmPageOptions[0])

  const [onCreatePost, resultCreatePost] = useMutation(gqlCreatePost, {
    context: { headers: getHeaders() },
    update: (cache, {data: {createPost}}) => {

      // let {state} = history.location
      // switch(state.from){
      //   case "/posts":{
          const data1 = cache.readQuery({
            query: gqlPosts,
            variables: {
              userId: _.isEmpty(user) ? "" : user._id,
              page: 0, 
              perPage: 30
            }
          });

          console.log("onCreatePost data1:", data1)

          if(data1 != null){ 
            let newPosts = {...data1.posts}
            let newData = [...newPosts.data, createPost]

            cache.writeQuery({
              query: gqlPosts,
              data: { posts: {...newPosts, data: newData} },
              variables: {
                userId: _.isEmpty(user) ? "" : user._id,
                page: 0, 
                perPage: 30
              }
            });
          }
      //     break;
      //   }

      //   default:{

      //     break;
      //   }
      // }
    },
    onCompleted({ data }) {
      history.push("/posts")
    },
    onError({error}){
      console.log("onError :")
    }
  });
  console.log("resultCreatePost :", resultCreatePost)

  const [onUpdatePost, resultUpdatePost] = useMutation(gqlUpdatePost, {
    context: { headers: getHeaders() },
    update: (cache, {data: {updatePost}}) => {
      // let {state} = history.location
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
    },
    onCompleted({ data }) {
      history.push("/posts");
    },
    onError({error}){
      console.log("onError :")
    }
  });
  console.log("resultUpdatePost :", resultUpdatePost)

  switch(mode){
    case "new":{
      editValues = undefined
      break;
    }
   
    case "edit":{
      bookmarksByPostIdValues = useQuery(gqlBookmarksByPostId, {
        context: { headers: getHeaders() },
        variables: { postId: id },
        notifyOnNetworkStatusChange: true,
      });
      console.log("bookmarksByPostIdValues : ", bookmarksByPostIdValues)
    
      shareValues = useQuery(gqlShareByPostId, {
        context: { headers: getHeaders() },
        variables: {postId: id},
        notifyOnNetworkStatusChange: true,
      });
      // console.log("shareValues : ", shareValues)
    
      editValues = useQuery(gqlPost, {
        context: { headers: getHeaders() },
        variables: {id},
        notifyOnNetworkStatusChange: true,
      });

      console.log("editValues : ", editValues)

      if(_.isEqual(input, initValues)) {
        if(!_.isEmpty(editValues)){
          let {loading}  = editValues
          
          if(!loading){
            let {status, data} = editValues.data.post

            console.log("edit editValues : ", editValues.data)
            if(status){

            //   if( data.ownerId != user.id){
            //     history.push("/")
            //   }

              setInput({
                title: data.title, 
                nameSubname: data.nameSubname, 
                idCard: data.idCard, 
                amount: data.amount,
                tels: data.tels,
                banks: data.banks,
                description: data.description,
                dateTranfer: data.dateTranfer,
                attackFiles: data.files
              })
            }
          }
        }
      }
      break;
    }
  }

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
        case "title": {
          if (!value) {
            stateObj[name] = "Please enter title.";
          }
          break;
        }

        case "nameSubname": {
          if (!value) {
            stateObj[name] = "Please enter name subname.";
          }
          break;
        }

        // case "idCard": {
        //   if (!value) {
        //     stateObj[name] = "Please enter id card.";
        //   } 
        //   break;
        // }

        case "amount": {
          if (!value) {
            stateObj[name] = "Please enter amount.";
          } 

          break;
        }

        default:
          break;
      }

      return stateObj;
    });
  };

  const submitForm = async(event) => {
    event.preventDefault();

    // let oldAttackFiles = _.filter( input.attackFiles,  p => p.base64 )
    // let newAttackFiles = _.filter( input.attackFiles,  p => !p.base64 )

    // let newAttackFilesBase64 =  await Promise.all(newAttackFiles.map(convertFileToBase64)).then(base64Pictures =>{return base64Pictures});

    switch(mode){
      case "new":{
        let newInput =  {
                          title: input.title,
                          nameSubname: input.nameSubname,
                          idCard: input.idCard,
                          amount: input.amount,
                          tels: input.tels,
                          banks: input.banks, // _.omitDeep(input.banks, ['__typename']),
                          description: input.description,
                          dateTranfer: input.dateTranfer,
                          files: input.attackFiles,//[...newAttackFilesBase64, ...oldAttackFiles],
                          ownerId: user._id
                      }

        onCreatePost({ variables: { input: newInput } });
        break;
      }
      case "edit":{

        let newInput = {
                      title: input.title,
                      nameSubname: input.nameSubname,
                      idCard: input.idCard,
                      amount: input.amount,
                      tels: input.tels,
                      banks: input.banks, //_.omitDeep(input.banks, ['__typename']),
                      description: input.description,
                      dateTranfer: input.dateTranfer,
                      files:  input.attackFiles, //_.omitDeep(_.filter([...newAttackFilesBase64, ...oldAttackFiles], (v, key) => !v.delete), ['__typename', 'id']),
                      ownerId: user._id
                    }

        console.log("newInput : ", editValues.data.post.data._id, _.omitDeep(newInput, ['__typename']), input.attackFiles, newInput)

        onUpdatePost({ variables: { 
          id: editValues.data.post.data._id,
          input: newInput//_.omitDeep(newInput, ['__typename'])
        }});
      }
    }
  };

  const mainView = () =>{
    console.log("mainView : ", mode)
    switch(mode){
      case "new":{
        return  <LocalizationProvider dateAdapter={AdapterDateFns} >
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "50ch" }
                    }}
                    onSubmit={submitForm}>
                    <div >
                      <TextField
                        id="post-title"
                        name="title"
                        label={t("search_by_title")}
                        variant="filled"
                        required
                        value={input.title}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        helperText={error.title}
                        error={_.isEmpty(error.title) ? false : true}
                      />
                      <TextField
                        id="post-name-subname"
                        name="nameSubname"
                        label={t("search_by_name_surname")}
                        variant="filled"
                        required
                        value={input.nameSubname}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        helperText={error.nameSubname}
                        error={_.isEmpty(error.nameSubname) ? false : true}
                      />
                      <TextField
                        id="post-idcard"
                        name="idCard"
                        label={t("search_by_card_id")}
                        variant="filled"
                        // required
                        value={input.idCard}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        helperText={error.idCard}
                        // error={_.isEmpty(error.idCard) ? false : true}
                      />
                      <TextField
                        id="post-amount"
                        name="amount"
                        label={t("amount")}
                        variant="filled"
                        type="number"
                        required
                        value={input.amount}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        helperText={error.amount}
                        error={_.isEmpty(error.amount) ? false : true}
                      />
                      <DesktopDatePicker
                        label={t("date_tranfer")}
                        inputFormat="dd/MM/yyyy"
                        value={ input.dateTranfer }
                        onChange={(newDate) => {
                          setInput({...input, dateTranfer: newDate})
                        }}
                        renderInput={(params) => <TextField {...params} required={input.dateTranfer === null ? true: false} />}
                      />
                      <TelInputField
                        label={t("search_by_tel")}
                        values={input.tels}
                        onChange={(values) => {
                          console.log("Tel onChange >> :", values);
                          // setTels(values)
                          setInput({...input, tels: values})
                        }}
                      />
                      <BankInputField
                        label={t("search_by_id_bank")}
                        values={input.banks}
                        onChange={(values) => {
                          console.log("BankInputField : ", values)
                          setInput({...input, banks: values})
                        }}
                      />
                      <Editor 
                        label={t("detail")} 
                        initData={ input.description }
                        onEditorChange={(newDescription)=>{
                          setInput({...input, description: newDescription})
                        }} />

                      <AttackFileField
                        label={t("attack_file")}
                        values={input.attackFiles}
                        onChange={(values) => {
                          console.log("AttackFileField :", values)
                          setInput({...input, attackFiles: values})
                        }}
                        onSnackbar={(data) => {
                          setSnackbar(data);
                        }}
                      />

                    </div>
                    <Button type="submit" variant="contained" color="primary">
                      {t("create")}
                    </Button>
                  </Box>
                </LocalizationProvider>
      }
     
      case "edit":{
        return  editValues != null && editValues.loading
                ? <div><CircularProgress /></div> 
                : <Tabs>
                    <Panel title="Detail">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": { m: 1, width: "50ch" }
                          }}
                          onSubmit={submitForm}>
                          <div>
                            <TextField
                              id="post-title"
                              name="title"
                              label="Title"
                              variant="filled"
                              required
                              value={input.title}
                              onChange={onInputChange}
                              onBlur={validateInput}
                              helperText={error.title}
                              error={_.isEmpty(error.title) ? false : true}
                            />

                            <TextField
                              id="post-name-subname"
                              name="nameSubname"
                              label="Name Subname"
                              variant="filled"
                              required
                              value={input.nameSubname}
                              onChange={onInputChange}
                              onBlur={validateInput}
                              helperText={error.nameSubname}
                              error={_.isEmpty(error.nameSubname) ? false : true}
                            />

                            <TextField
                              id="post-idcard"
                              name="idCard"
                              label="ID Card"
                              variant="filled"
                              // required
                              value={input.idCard}
                              onChange={onInputChange}
                              onBlur={validateInput}
                              helperText={error.idCard}
                              // error={_.isEmpty(error.idCard) ? false : true}
                            />

                            <TextField
                              id="post-amount"
                              name="amount"
                              label="Amount"
                              variant="filled"
                              type="number"
                              required
                              value={input.amount}
                              onChange={onInputChange}
                              onBlur={validateInput}
                              helperText={error.amount}
                              error={_.isEmpty(error.amount) ? false : true}
                            />

                            <DesktopDatePicker
                              label="Date"
                              inputFormat="dd/MM/yyyy"
                              value={ input.dateTranfer }
                              onChange={(newDate) => {
                                setInput({...input, dateTranfer: newDate})
                              }}
                              renderInput={(params) => <TextField {...params} required={input.dateTranfer === null ? true: false} />}
                            />

                            <TelInputField
                              values={input.tels}
                              onChange={(values) => {
                                console.log("Tel onChange >> :", values);
                                // setTels(values)
                                setInput({...input, tels: values})
                              }}
                            />

                            <BankInputField
                              values={input.banks}
                              onChange={(values) => {
                                console.log("BankInputField : ", values)
                                setInput({...input, banks: values})
                              }}
                            />

                            <Editor 
                              label={"Description"} 
                              initData={ input.description }
                              onEditorChange={(newDescription)=>{
                                setInput({...input, description: newDescription})
                              }} />

                            <AttackFileField
                              values={input.attackFiles}
                              onChange={(values) => {
                                // console.log("attackFiles :", attackFiles)
                                setInput({...input, attackFiles: values})
                              }}
                              onSnackbar={(data) => {
                                setSnackbar(data);
                              }}
                            />

                          </div>
                          <Button type="submit" variant="contained" color="primary">
                            {t("update")}
                          </Button>
                        </Box>
                      </LocalizationProvider>
                    </Panel>
                    <Panel title={bookmarksByPostIdValues.loading ? "Bookmarks" : "Bookmarks (" + bookmarksByPostIdValues.data.bookmarksByPostId.data.length  +")"}>
                      {
                        bookmarksByPostIdValues.loading 
                        ? <div><CircularProgress /></div> 
                        : <div style={{ height: 700, width: "1000px" }}>
                            <DataGrid 
                              rows={bookmarksByPostIdValues.data.bookmarksByPostId.data} 
                              columns={bmColumns} 
                              rowHeight={80}

                              pageSize={bmPerPage}
                              onPageSizeChange={(newPerPage) => {
                                setBmPerPage(newPerPage)
                                setBmPage(0)
                              }}
                              rowsPerPageOptions={bmPageOptions}
                              page={bmPage}
                              onPageChange={(newPage) =>{
                                setBmPage(newPage)
                              }}/>
                          </div>
                      }
                    </Panel> 
                    <Panel title={shareValues.loading ? "Shares" : "Shares (" + shareValues.data.shareByPostId.data.length  +")"}>
                      {
                        shareValues.loading
                        ? <div><CircularProgress /></div> 
                        : <div style={{ height: 700, width: "1000px" }}>
                            <DataGrid 
                              rows={shareValues.data.shareByPostId.data} 
                              columns={shcolumns} 
                              rowHeight={80}

                              pageSize={bmPerPage}
                              onPageSizeChange={(newPerPage) => {
                                setBmPerPage(newPerPage)
                                setBmPage(0)
                              }}
                              rowsPerPageOptions={bmPageOptions}
                              page={bmPage}
                              onPageChange={(newPage) =>{
                                setBmPage(newPage)
                              }}/>
                          </div>

                      }
                    </Panel>
                  </Tabs>
      }
    }
  }

  return (
    <div className="page-post pl-2 pr-2 mb-4">
      <div className="MuiBox-root-postinss">
      { mainView() }
      {snackbar.open && (
        <PopupSnackbar
          isOpen={snackbar.open}
          message={snackbar.message}
          onClose={() => {
            setSnackbar({...snackbar, open:false});
          }}
        />
      )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
  }
};

export default connect( mapStateToProps, null )(Post);
