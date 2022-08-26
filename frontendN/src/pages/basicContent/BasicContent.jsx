import {
  NewUserContainer,
  NewUserForm,
  FormItem,
  GenderContainer,
  NewUserButton
} from "./BasicContent.styled";

import React , {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Editor from "../../components/editor/Editor";

import { gqlBasicContent, gqlCreateBasicContent, gqlUpdateBasicContent } from "../../gqlQuery"

let editValues = undefined;
let initValues =  { name : "",  description: "" }

const BasicContent = (props) => {
  let history = useHistory();
  let { id, mode } = useParams();
  let [input, setInput] = useState(initValues)

  const [onCreateBasicContent, resultCreateBasicContent] = useMutation(gqlCreateBasicContent
    , {
        onCompleted({ data }) {
          history.push("/basic-contents");
        }
      }
  );

  console.log("resultCreateBasicContent :", resultCreateBasicContent)

  const [onUpdateBasicContent, resultUpdateBasicContent] = useMutation(gqlUpdateBasicContent, 
    {
      update: (cache, {data: {updateBasicContent}}) => {

        const data1 = cache.readQuery({
          query: gqlBasicContent,
          variables: {id}
        });

        let newData = {...data1.basicContent, data: updateBasicContent}
 
        cache.writeQuery({
          query: gqlBasicContent,
          data: {
            basicContent: newData
          },
          variables: {id}
        });
      },
      onCompleted({ data }) {
        history.push("/basic-contents");
      }
    }
  );

  console.log("resultUpdateBasicContent : ", resultUpdateBasicContent)

  

  switch(mode){
    case "new":{
      editValues = undefined
      break;
    }

    case "edit":{
      editValues = useQuery(gqlBasicContent, { variables: {id}, notifyOnNetworkStatusChange: true });
     
      console.log("editValues : ", editValues, input)

      if(_.isEqual(input, initValues)) {
        if(!_.isEmpty(editValues)){
          let {loading}  = editValues
          
          if(!loading){
            let {status, data} = editValues.data.basicContent

            console.log("edit editValues : ", status,  data, data.name)
            if(status){
              setInput({
                name: data.name,
                description: data.description
              })
            }
          }
        }
      }
      break;
    }
  }

  const submitForm = (event) => {
    event.preventDefault();

    switch(mode){
      case "new":{
        onCreateBasicContent({ variables: { input: { name: input.name, description: input.description } } });
        break;
      }

      case "edit":{
        let newInput =  {name: input.name, description: input.description }

        onUpdateBasicContent({ variables: { 
          id: editValues.data.basicContent.data._id,
          input: newInput
        }});

        break;
      }
    }
  };

  const mainView = () =>{
    switch(mode){
      case "new":{
        return  <div>
                  <TextField
                    id="filled-basic"
                    name="name"
                    label="Name"
                    variant="filled"
                    value={input.name}
                    required
                    onChange={(e) => {
                      console.log("name : ", e.target.value)
                      setInput({...input, name:e.target.value})
                    }}
                  />
                  <Editor 
                    name="description" 
                    label={"Description"}  
                    initData={input.description}
                    onEditorChange={(newValue)=>{
                      setInput({...input, description:newValue})
                    }}/>

                  <Button type="submit" variant="contained" color="primary">
                    CREATE
                  </Button>
                </div>
      }
  
      case "edit":{
       return editValues != null && editValues.loading
              ? <div><CircularProgress /></div> 
              : <div>
                  <TextField
                    id="filled-basic"
                    name="name"
                    label="Name"
                    variant="filled"
                    value={input.name}
                    required
                    onChange={(e) => {
                      console.log("name : ", e.target.value)
                      setInput({...input, name:e.target.value})
                    }}
                  />
                  <Editor 
                    name="description" 
                    label={"Description"}  
                    initData={input.description}
                    onEditorChange={(newValue)=>{
                      setInput({...input, description:newValue})
                    }}/>

                  <Button type="submit" variant="contained" color="primary">
                    UPDATE
                  </Button>
                </div>
      }
    }
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" }
        }}
        onSubmit={submitForm}>
        {mainView()}
      </Box>
    </div>
  );
};

export default BasicContent;
