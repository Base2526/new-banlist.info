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

import PopupSnackbar from "../home/PopupSnackbar";
import Editor from "../../components/editor/Editor";

import { gqlTReport, gqlCreateTReport, gqlUpdateTReport } from "../../gqlQuery"

import AttackFileField from "../post/AttackFileField";

let editValues = undefined;
let initValues = { nameSurname:"", email:"", tel:"", topic:"", description:"",  attackFiles: [] }
  
const ContactUs = (props) => {
  let history = useHistory();

  const [input, setInput] = useState(initValues)
  const [snackbar, setSnackbar] = useState({open:false, message:""});

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

  const onInputChange = (e) => {
    
    const { name, value } = e.target;

    console.log("onInputChange :", name, value)
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    // setError((prev) => {
    //   const stateObj = { ...prev, [name]: "" };
    //   switch (name) {
    //     case "title": {
    //       if (!value) {
    //         stateObj[name] = "Please enter title.";
    //       }
    //       break;
    //     }

    //     case "nameSubname": {
    //       if (!value) {
    //         stateObj[name] = "Please enter name subname.";
    //       }
    //       break;
    //     }

    //     case "amount": {
    //       if (!value) {
    //         stateObj[name] = "Please enter amount.";
    //       } 

    //       break;
    //     }

    //     default:
    //       break;
    //   }
    //   return stateObj;
    // });
  };

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
              name="nameSurname"
              label="Name Surname"
              variant="filled"
              value={input.nameSurname}
              required
              onChange={onInputChange}
            />

            <TextField
              name="email"
              label="Email"
              variant="filled"
              value={input.email}
              required
              onChange={onInputChange}/>

            <TextField
              name="tel"
              label="Tel"
              variant="filled"
              value={input.tel}
              required
              onChange={onInputChange}/>

            <FormControl sx={{ m: 1, minWidth: 250 }}>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                name="topic"
                value={input.topic}
                label="Topic"
                onChange={onInputChange}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

            <Editor 
              name="description" 
              label={"Description"}  
              initData={input.description}
              onEditorChange={(value)=>{
                onInputChange({ target:{ name: "description",  value }})
              }}/>
            <AttackFileField
              name="attackFiles" 
              values={input.attackFiles}
              onChange={(value) => {
                console.log("AttackFileField :", value)
                // setInput({...input, attackFiles: values})

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
  