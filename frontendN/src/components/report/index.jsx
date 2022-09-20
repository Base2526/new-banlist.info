import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from "@material-ui/core/Avatar";
import Autocomplete from "@mui/material/Autocomplete";
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery, useMutation } from "@apollo/client";
import { gqlTReportList, gqlCreateTReport } from "../../gqlQuery"

const index =({open, postId, onReport,  onClose})=> {

  const [input, setInput] = useState({
    categoryId: "",
    description: ""
  })

  const tReportView = useQuery(gqlTReportList, {
    variables: {page: 0, perPage: 20},
    notifyOnNetworkStatusChange: true,
  });

  console.log("tReportView :", tReportView)

  const categoryView = () =>{
    return  <Autocomplete
              // multiple
              id="category"
              name="category"
              options={ tReportView.data.TReportList.data }
              getOptionLabel={(option) => option.name}
              // value={ value }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Category"
                  required={ _.isEmpty(input.categoryId) ? true : false }
                />
              )}
              onChange={(event, value)=>{
                setInput({...input, categoryId:value.id})
              }}
            />
  }

  const onSubmit = (e) =>{
    console.log("onReport :", postId, input)

    onReport({
          postId: postId,     
          categoryId: input.categoryId,
          description: input.description
    })
  }

  return (
      <Dialog 
      onClose={onClose} 
      open={open}>
        <DialogTitle>REPORT</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            <Avatar>H</Avatar>
          </DialogContentText> */}

          {
            tReportView.loading
            ? <LinearProgress sx={{width:"100px"}} /> 
            : categoryView()
          }

          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="message"
            value={input.description}
            fullWidth
            variant="standard"
            multiline
            rows={4}
            onChange={(e)=>{
              setInput({...input, description:e.target.value})
            }}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClose}>CLOSE</Button> */}
          <Button onClick={onSubmit}>REPORT</Button>
        </DialogActions>
      </Dialog>
  );
}

export default index 