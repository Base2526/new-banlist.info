import {
    UserListContainer,
    UserWrapper,
    EditButton,
    ButtonWrapper
} from "./ContactUsList.styled";
import { useState, useContext, useEffect, useMemo, useRef, useCallback  } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from "@mui/material/Avatar";
import _ from "lodash"
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery } from "@apollo/client";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import {gqlReport, gqlPost, gqlUser, gqlTReport} from "../../gqlQuery"
// import Footer from "../footer";
import Table from "../../TableContainer"
  
const ContactUsList = (props) => {
    let history = useHistory();
  
    const [pageOptions, setPageOptions] = useState([30, 50, 100]);  
    const [pageIndex, setPageIndex] = useState(0);  
    const [pageSize, setPageSize] = useState(pageOptions[0])

    const reportValues = useQuery(gqlReport, {
      variables: {page: pageIndex, perPage: pageSize},
      notifyOnNetworkStatusChange: true,
    });

    console.log("reportValues :", reportValues)

  
    const [openDialogDelete, setOpenDialogDelete] = useState({
      isOpen: false,
      id: ""
    });


    ///////////////
    const fetchData = useCallback(
      ({ pageSize, pageIndex }) => {
      console.log("fetchData is being called #1")

      setPageSize(pageSize)
      setPageIndex(pageIndex)
    })
    ///////////////
    
    const handleDelete = (id) => {
      setUserData(userData.filter((user) => user._id !== id));
    };
  
    const handleClose = () => {
      // setOpen(false);
      setOpenDialogDelete({ ...openDialogDelete, isOpen: false });
    };

    ///////////////////////

     const columns = useMemo(
      () => [
        // 
        {
          Header: 'Contact us',
          columns: [
            {
              Header: 'Name',
              accessor: 'userId',
              Cell: props =>{
                let value = useQuery(gqlUser, {
                  variables: {id: props.value},
                  notifyOnNetworkStatusChange: true,
                });
      
                return  value.loading 
                        ? <LinearProgress sx={{width:"100px"}} />
                        : <Typography variant="overline" display="block" gutterBottom>
                            {value.data.user.data.displayName}
                          </Typography>
              }
            },
            {
              Header: 'Category name',
              accessor: 'categoryId',
              Cell: props =>{
                let value = useQuery(gqlTReport, {
                  variables: {id: props.value},
                  notifyOnNetworkStatusChange: true,
                });

                return  value.loading 
                        ? <LinearProgress sx={{width:"100px"}} />
                        : <Typography variant="overline" display="block" gutterBottom>
                            {value.data.TReport.data.name}
                          </Typography>
              } 
            },
            {
              Header: 'Post name',
              accessor: 'postId',
              Cell: props =>{
                  let value = useQuery(gqlPost, {
                    variables: {id:  props.value},
                    notifyOnNetworkStatusChange: true,
                  });

                  console.log("postId :", value)
                  return  value.loading 
                          ? <LinearProgress sx={{width:"100px"}} />
                          : <Typography variant="overline" display="block" gutterBottom>
                              { _.isEmpty(value.data.post.data) ? "" : value.data.post.data.title }
                            </Typography>
              }
            },
            {
              Header: 'Description',
              accessor: 'message',
              Cell: props => <Typography dangerouslySetInnerHTML={{ __html: props.value }} />
            },
            {
              Header: 'Created At',
              accessor: 'createdAt',
            }
          ],
        }
      ],
      []
    )
  
    // const [data, setData] = useState(() => makeData(10000))
    // const [originalData] = useState(data)
  
    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.
    const skipResetRef = useRef(false)
  
    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
      console.log("updateMyData")
      // We also turn on the flag to not reset the page
      skipResetRef.current = true
      // setData(old =>
      //   old.map((row, index) => {
      //     if (index === rowIndex) {
      //       return {
      //         ...row,
      //         [columnId]: value,
      //       }
      //     }
      //     return row
      //   })
      // )
    }
  
    // After data changes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    // useEffect(() => {
    //   skipResetRef.current = false
  
    //   console.log("data :", data)
    // }, [data])
  
  
    //////////////////////
  
    return (
      <UserListContainer>
        {
          reportValues.loading
          ?  <div><CircularProgress /></div> 
          :   <Table
                columns={columns}
                data={reportValues.data.ReportList.data}
                fetchData={fetchData}
                rowsPerPage={pageOptions}
                updateMyData={updateMyData}
                skipReset={skipResetRef.current}
                isDebug={false}
              />
        }

        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={(e)=>{
            history.push("/contact-us/new");
          }}/>
          
        {openDialogDelete.isOpen && (
          <Dialog
            open={openDialogDelete.isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Delete
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  handleDelete(openDialogDelete.id);
  
                  setOpenDialogDelete({ isOpen: false, id: "" });
                }}
              >
                Delete
              </Button>
              <Button variant="contained" onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </UserListContainer>
    );
  };
  
  export default ContactUsList;
  