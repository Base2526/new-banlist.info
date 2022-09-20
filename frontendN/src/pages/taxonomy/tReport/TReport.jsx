import {
  NewUserContainer,
  NewUserForm,
  FormItem,
  GenderContainer,
  NewUserButton
} from "./TReport.styled";

import React , {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Editor from "../../../components/editor/Editor";

import { gqlTReport, gqlCreateTReport, gqlUpdateTReport } from "../../../gqlQuery"

let editValues = undefined;
let initValues = { name: "",  description: "" }
  
const TReport = (props) => {
  let history = useHistory();

  const [input, setInput] = useState(initValues)

  const [onCreateTReport, resultCreateTReportValues] = useMutation(gqlCreateTReport
    , {
        onCompleted({ data }) {
          history.push("/treport-list");
        }
      }
  );

  const [onUpdateTReport, resultUpdateTReportValues] = useMutation(gqlUpdateTReport, 
    {
      onCompleted({ data }) {
        history.push("/treport-list");
      }
    }
  );

  console.log("resultUpdateTReportValues : ", resultUpdateTReportValues)

  let { id, mode } = useParams();

  console.log("editValues : ", editValues, id, mode)

  switch(mode){
    case "new":{
      editValues = undefined
      break;
    }

    case "edit":{
      editValues = useQuery(gqlTReport, {
        variables: {id},
        notifyOnNetworkStatusChange: true,
      });
     
      // console.log("editValues : ", editValues)

      if(_.isEqual(input, initValues)) {
        if(!_.isEmpty(editValues)){
          let {loading}  = editValues
          
          if(!loading){
            let {status, data} = editValues.data.TReport

            console.log("edit editValues : ", status, data.name, data.description)
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

    console.log("submitForm : ", input);

    switch(mode){
      case "new":{
        onCreateTReport({ variables: { input: {
              name: input.name,
              description: input.description
            }
          } 
        });
        break;
      }

      case "edit":{
        let newInput =  {
                          name: input.name,
                          description: input.description
                        }

        console.log("newInput :", newInput, editValues.data.TReport.data.id)
        onUpdateTReport({ variables: { 
          id: editValues.data.TReport.data.id,
          input: newInput
        }});

        break;
      }
    }

  };

  return (
    <div>
      {
        editValues != null && editValues.loading
        ? <div><CircularProgress /></div> 
        :
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "50ch" }
            }}
            // noValidate
            // autoComplete="off"
            onSubmit={submitForm}
          >
            <TextField
              // id="filled-basic"
              name="name"
              label="Name"
              variant="filled"
              value={input.name}
              required
              onChange={(e) => {

                let newValue =  {...input, name:e.target.value}

                console.log("newValue : ", newValue)
                setInput(newValue)
              }}
            />

            <Editor 
              name="description" 
              label={"Description"}  
              initData={input.description}
              onEditorChange={(e)=>{

                let newValue =  {...input, description: e}
                console.log("newValue :", newValue)
                setInput(newValue)
              }}/>

            <Button type="submit" variant="contained" color="primary">
              {mode === 'new' ? "CREATE" : "UPDATE"}
            </Button>
          </Box>
      }
      </div>
  );
};

export default TReport;
  