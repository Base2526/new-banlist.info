import {
    UserListContainer,
    UserWrapper,
    EditButton,
    ButtonWrapper
} from "./BookmarkList.styled";
import { useState, useContext, useEffect, useMemo, useRef, useCallback } from "react";
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
import Box from "@mui/material/Box";
import _ from "lodash"
import LinearProgress from '@mui/material/LinearProgress';
import { useQuery } from "@apollo/client";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";

import { getHeaders } from "../../util"
import { gqlBookmarks, gqlPost, gqlUser } from "../../gqlQuery"
import Table from "../../TableContainer"
  
const BookmarkList = (props) => {
  let history = useHistory();
  const { t } = useTranslation();

  const [pageOptions, setPageOptions] = useState([30, 50, 100]);  
  const [pageIndex, setPageIndex] = useState(0);  
  const [pageSize, setPageSize] = useState(pageOptions[0])

  const bookmarkValues = useQuery(gqlBookmarks, {
    context: { headers: getHeaders() },
    variables: {page: pageIndex, perPage: pageSize},
    notifyOnNetworkStatusChange: true,
  });

  console.log("bookmarkValues :", bookmarkValues)

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
      {
        Header: 'Username',
        accessor: 'userId',
        // Use a two-stage aggregator here to first
        // count the total rows being aggregated,
        // then sum any of those counts if they are
        // aggregated further
        // aggregate: 'count',
        // Aggregated: ({ value }) => `${value} Names`,
        Cell: props =>{

          let value = useQuery(gqlUser, {
            variables: {id: props.row.original.userId},
            notifyOnNetworkStatusChange: true,
          });

          // console.log("value.data.user.data :", value.loading ? "" : value.data.user.data)
          return  value.loading 
                  ? <LinearProgress sx={{width:"100px"}} />
                  : <Typography variant="overline" display="block" gutterBottom>
                      { value.data.user.data === null ? "" : value.data.user.data.displayName}
                    </Typography>
        }
      },
      {
        Header: 'Post name',
        accessor: 'postId',
        // Use our custom `fuzzyText` filter on this column
        // filter: 'fuzzyText',
        // // Use another two-stage aggregator here to
        // // first count the UNIQUE values from the rows
        // // being aggregated, then sum those counts if
        // // they are aggregated further
        // aggregate: 'uniqueCount',
        // Aggregated: ({ value }) => `${value} Unique Names`,
        Cell: props => {
          let postValue = useQuery(gqlPost, {
            variables: {id: props.row.original.postId},
            notifyOnNetworkStatusChange: true,
          });

          console.log("postValue :", postValue, props.row.original.postId)

          return  postValue.loading 
                  ? <LinearProgress sx={{width:"100px"}} />
                  : <Link to={`/detail/${props.row.original.postId}`}>
                    { _.isEmpty(postValue.data.post.data) ? "" : postValue.data.post.data.title}
                  </Link>
  
          // return  postValue.loading 
          //         ? <LinearProgress sx={{width:"100px"}} />
          //         : <Typography variant="overline" display="block" gutterBottom>
          //             { _.isEmpty(postValue.data.post.data) ? "" : postValue.data.post.data.title}
          //           </Typography>
        }
      },
      {
        Header: 'Action',
        // accessor: 'id',
        // Use our custom `fuzzyText` filter on this column
        // filter: 'fuzzyText',
        // // Use another two-stage aggregator here to
        // // first count the UNIQUE values from the rows
        // // being aggregated, then sum those counts if
        // // they are aggregated further
        // aggregate: 'uniqueCount',
        // Aggregated: ({ value }) => `${value} Unique Names`,
        Cell: props => {
          console.log("Cell :", props)
          return  <div className="Btn--posts">
                    {/* <Link to={`/bookmark/${props.row.original.id}/edit`}>
                      <button>Edit</button>
                    </Link> */}
                    <button><DeleteForeverIcon /> Delete</button>
                  </div>
        }
      },
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
      <div className="pl-2 pr-2">
        <Box style={{
          flex: 4
        }} className="table-responsive">
          {
            bookmarkValues.loading
            ?   <div><CircularProgress /></div> 
            :   <Table
                  columns={columns}
                  data={bookmarkValues.data.bookmarks.data}
                  fetchData={fetchData}
                  rowsPerPage={pageOptions}
                  updateMyData={updateMyData}
                  skipReset={skipResetRef.current}
                  isDebug={false}
                />
          }
            
          {openDialogDelete.isOpen && (
            <Dialog
              open={openDialogDelete.isOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{t("confirm_delete")}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {openDialogDelete.description}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleDelete(openDialogDelete.id);
    
                    setOpenDialogDelete({ isOpen: false, id: "" });
                  }}
                >{t("delete")}</Button>
                <Button variant="contained" onClick={handleClose} autoFocus>{t("close")}</Button>
              </DialogActions>
            </Dialog>
          )}
          {/* <Footer /> */}
        </Box>
      </div>
    );
  };
  
  export default BookmarkList;
  