import React , {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import PopupSnackbar from "../home/PopupSnackbar";
import Editor from "../../components/editor/Editor";

import { gqlContactUs, gqlTopics, gqlCreateAndUpdateContactUs} from "../../gqlQuery"

import AttackFileField from "../post/AttackFileField";
import _ from "lodash";

let editValues = undefined;
let initValues = { nameSurname:"", email:"", tel:"", topic:"", description:"",  attackFiles: [] }
  
// 
const ContactUs = (props) => {
  let history = useHistory();

  const [input, setInput] = useState(initValues)
  const [snackbar, setSnackbar] = useState({open:false, message:""});

  const [error, setError] = useState({ nameSurname:"", email:"", tel:"", topic:"", description:"" });

  const topicValues = useQuery(gqlTopics, { notifyOnNetworkStatusChange: true });

  console.log("topicValues :", topicValues)
 
  const [onCreateAndUpdateContactUs, resultCreateAndUpdateContactUsValues] = useMutation(gqlCreateAndUpdateContactUs
    , {
        onCompleted({ data }) {
          history.push("/contact-us-list");
        }
      }
  );

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
        case "nameSurname": {
          if (!value) {
            stateObj[name] = "Please enter name surname.";
          }
          break;
        }

        case "email": {
          if (!value) {
            stateObj[name] = "Please enter email.";
          }
          break;
        }

        case "tel": {
          if (!value) {
            stateObj[name] = "Please enter tel.";
          } 
          break;
        }

        case "topic": {
          if (!value) {
            stateObj[name] = "Please enter topic.";
          } 
          break;
        }

        case "description": {
          if (!value) {
            stateObj[name] = "Please enter description.";
          } 
          break;
        }

        default:
          break;
      }
      return stateObj;
    });
  };

  let { id, mode } = useParams();

  console.log("editValues : ", editValues, id, mode)

  switch(mode){
    case "new":{
      editValues = undefined
      break;
    }

    case "edit":{
      editValues = useQuery(gqlContactUs, { variables: {id}, notifyOnNetworkStatusChange: true });
     
      console.log("editValues : ", editValues)

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
        // onCreateAndUpdateContactUs({ variables: { input: {
        //       name: input.name,
        //       description: input.description
        //     }
        //   } 
        // });
        break;
      }

      case "edit":{
        // let newInput =  {
        //                   name: input.name,
        //                   description: input.description
        //                 }

        // console.log("newInput :", newInput, editValues.data.TReport.data.id)
        // onCreateAndUpdateContactUs({ variables: { 
        //   id: editValues.data.TReport.data.id,
        //   input: newInput
        // }});

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
              name="nameSurname"
              label="Name Surname"
              variant="filled"
              value={input.nameSurname}
              required
              onChange={onInputChange}
              onBlur={validateInput}
              helperText={error.nameSurname}
              error={_.isEmpty(error.nameSurname) ? false : true}
            />

            <TextField
              name="email"
              label="Email"
              variant="filled"
              value={input.email}
              required
              onChange={onInputChange}
              onBlur={validateInput}
              helperText={error.email}
              error={_.isEmpty(error.email) ? false : true}/>

            <TextField
              name="tel"
              label="Tel"
              variant="filled"
              value={input.tel}
              required
              onChange={onInputChange}
              onBlur={validateInput}
              helperText={error.tel}
              error={_.isEmpty(error.tel) ? false : true}/>

            <FormControl sx={{ m: 1, minWidth: 250 }} error={_.isEmpty(error.topic) ? false : true}>
              <InputLabel id="demo-simple-select-label">Topic *</InputLabel>
              <Select
                name="topic"
                value={input.topic}
                label="Topic"
                onChange={onInputChange}
                onBlur={validateInput}>
                {
                  topicValues.loading
                  ? <LinearProgress />
                  : _.map(topicValues.data.topics.data, (item)=> <MenuItem value={item._id}>{item.name}</MenuItem> )
                }
              </Select>
              <FormHelperText>{error.topic}</FormHelperText>
            </FormControl>
            {/* <FormControl  sx={{ m: 1 }} error={_.isEmpty(error.description) ? false : true} > */}
              <Editor 
                name="description" 
                label={"Description"}  
                initData={input.description}
                onEditorChange={(value)=>{
                  onInputChange({ target:{ name: "description",  value }})
                }}
                // onBlur={(e)=>{
                //   validateInput({ target:{ name: "description",  value: e.editor.getData() }})
                // }}
                />
              {/* <FormHelperText>{error.description}</FormHelperText> */}
            {/* </FormControl> */}
            <AttackFileField
              name="attackFiles" 
              values={input.attackFiles}
              onChange={(value) => {
                console.log("AttackFileField :", value)
                onInputChange({ target:{ name: "attackFiles",  value}})
              }}
              onSnackbar={(data) => {
                setSnackbar(data);
              }}
            />

            <Button type="submit" variant="contained" color="primary">
              {mode === 'new' ? "CREATE" : "UPDATE"}
            </Button>
          </Box>
      }

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
  );
};

export default ContactUs;
  