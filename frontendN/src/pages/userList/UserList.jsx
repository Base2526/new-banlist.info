import {
  UserListContainer,
  UserWrapper,
  EditButton,
  ButtonWrapper
} from "./UserList.styled";
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
import _ from "lodash"
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useQuery, useMutation } from "@apollo/client";
import LinearProgress from '@mui/material/LinearProgress';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";

import {gqlUsers, gqlPostsByUser, gqlDeleteUser} from "../../gqlQuery"
import Table from "../../TableContainer"

const UserList = (props) => {
  let history = useHistory();
  const { t } = useTranslation();

  const [pageOptions, setPageOptions] = useState([30, 50, 100]);  
  const [pageIndex, setPageIndex] = useState(0);  
  const [pageSize, setPageSize] = useState(pageOptions[0])

  const [openDialogDelete, setOpenDialogDelete] = useState({ isOpen: false, id: "", description: "" });

  const usersValue = useQuery(gqlUsers, {
    variables: {page: pageIndex, perPage: pageSize},
    notifyOnNetworkStatusChange: true,
  });

  console.log("usersValue :", usersValue)

  const [onDeleteUser, resultDeleteUser] = useMutation(gqlDeleteUser, 
    {
      update: (cache, {data: {deleteUser}}) => {
        const data1 = cache.readQuery({
          query: gqlUsers,
          variables: {page: pageIndex, perPage: pageSize},
        });

        let newUsers = {...data1.users}
        let newData   = _.filter(data1.users.data, user => user._id !== deleteUser._id)
        newUsers = {...newUsers, total: newData.length, data:newData }

        cache.writeQuery({
          query: gqlUsers,
          data: { users: newUsers },
          variables: {page: pageIndex, perPage: pageSize},
        });
      },
      onCompleted({ data }) {
        history.push("/users");
      }
    }
  );
  console.log("resultDeleteUser :", resultDeleteUser)

  ///////////////
  const fetchData = useCallback(
    ({ pageSize, pageIndex }) => {
    console.log("fetchData is being called #1")

    setPageSize(pageSize)
    setPageIndex(pageIndex)
  })
  ///////////////

  const handleDelete = (id) => {
    // setUserData(userData.filter((user) => user._id !== id));

    onDeleteUser({ variables: { id } });
  };

  const handleClose = () => {
    // setOpen(false);
    setOpenDialogDelete({ ...openDialogDelete, isOpen: false, description: "" });
  };

  ///////////////////////
  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'image',
        Cell: props =>{
          if(props.row.original.image.length < 1){
            return <Avatar
                    sx={{
                      height: 100,
                      width: 100
                    }}>A</Avatar>
          }
          return (
            <div style={{ position: "relative" }}>
              <Avatar
                sx={{
                  height: 100,
                  width: 100
                }}
                variant="rounded"
                alt="Example Alt"
                src={props.row.original.image[0].url}
              />
            </div>
          );
        }
      },
      {
        Header: 'Display name',
        accessor: 'displayName',
        Cell: props => {
          return  <Link to={`/user/${props.row.original._id}/view`}>
                    {props.row.original.displayName}
                  </Link>
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Posts',
        accessor: 'posts',
        Cell: props => {
          const postsByUser = useQuery(gqlPostsByUser, {
            variables: { userId: props.row.original.id },
            notifyOnNetworkStatusChange: true,
          });

          console.log("postsByUser :", postsByUser.data)

          if(postsByUser.data == null || postsByUser.data.postsByUser.data == null){
            return <></>
          }

          return postsByUser.loading
                ? <LinearProgress sx={{width:"100px"}} />
                : <>{postsByUser.data.postsByUser.data.length }</>  
        }
      },
      {
        Header: 'Last access',
        accessor: 'lastAccess',
      },
      {
        Header: 'Action',
        Cell: props => {
          console.log("Cell :", props)

          let {_id, displayName} = props.row.original
          return  <div className="Btn--posts">
                    <Link to={`/user/${_id}/edit`}>
                      <button><EditIcon/>{t("edit")}</button>
                    </Link>
                    <button onClick={(e)=>{
                      setOpenDialogDelete({ isOpen: true, id: _id, description: displayName });
                    }}><DeleteForeverIcon/>{t("delete")}</button>
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
      <UserListContainer className="table-responsive MuiBox-root">
        {
          usersValue.loading
          ? <div><CircularProgress /></div> 
          : <Table
              columns={columns}
              data={usersValue.data.users.data}
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

                  setOpenDialogDelete({ isOpen: false, id: "", description: "" });
                }}
              >{t("delete")}</Button>
              <Button variant="contained" onClick={handleClose} autoFocus>{t("close")}</Button>
            </DialogActions>
          </Dialog>
        )}

        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={(e)=>{
            history.push("/user/new");
          }}
        />
        {/* <Footer /> */}
      </UserListContainer>
    </div>
  );
};

export default UserList;
