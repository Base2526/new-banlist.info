import { Link } from "react-router-dom";
import { useState, useCallback, useMemo, useRef  } from "react";
import Box from "@mui/material/Box";
import { useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from '@mui/material/CircularProgress';
import _ from "lodash"
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { connect } from "react-redux";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";

import { getHeaders } from "../../util"
import { gqlPhones, gqlDeletePhone } from "../../gqlQuery"
import ReadMoreMaster from "../../utils/ReadMoreMaster"
import Table from "../../TableContainer"

const PhoneList = (props) => {
  let history = useHistory();
  const { t } = useTranslation();
  let { user } = props
  const [pageOptions, setPageOptions] = useState([30, 50, 100]);  
  const [pageIndex, setPageIndex]     = useState(0);  
  const [pageSize, setPageSize]       = useState(pageOptions[0])
  const [lightbox, setLightbox]       = useState({ isOpen: false, photoIndex: 0, images: [] });
  const [openDialogDelete, setOpenDialogDelete] = useState({ isOpen: false, id: "", description: "" });

  const [onDeletePhone, resultDeletePhone] = useMutation(gqlDeletePhone, {
    context: { headers: getHeaders() },
    update: (cache, {data: {deletePhone}}) => {
      const data1 = cache.readQuery({
        query: gqlPhones,
        variables: {userId: _.isEmpty(user) ? "" : user._id, page: pageIndex, perPage: pageSize},
      });

      let newPhones = {...data1.phones}
      let newData   = _.filter(data1.phones.data, phone => phone._id !== deletePhone._id)
      newPhones = {...newPhones, total: newData.length, data:newData }

      cache.writeQuery({
        query: gqlPhones,
        data: { phones: newPhones },
        variables: {userId: _.isEmpty(user) ? "" : user._id, page: pageIndex, perPage: pageSize},
      });
    },
    onCompleted({ data }) {
      history.push("/phones");
    }
  });
  console.log("resultDeletePhone :", resultDeletePhone)

  const phonesValue = useQuery(gqlPhones, {
    context: { headers: getHeaders() },
    variables: { page: pageIndex, perPage: pageSize },
    notifyOnNetworkStatusChange: true,
  });

  console.log("phonesValue :", phonesValue)

  ///////////////
  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setPageSize(pageSize)
    setPageIndex(pageIndex)
  })
  ///////////////

  const handleClose = () => {
    setOpenDialogDelete({ ...openDialogDelete, isOpen: false, description: "" });
  };

  const handleDelete = (id) => {
    onDeletePhone({ variables: { id } });
  };

  ///////////////////////
  const columns = useMemo(
    () => [
          {
            Header: 'Phones',
            accessor: 'phones',
            Cell: props =>{
                let {phones} = props.row.values

                return ( <div style={{ position: "relative" }}> {phones.join()} </div> );
            }
          },
          {
            Header: 'Detail',
            accessor: 'description',
            Cell: props => {
              return <Box
                      sx={{
                        maxHeight: "inherit",
                        width: "100%",
                        whiteSpace: "initial",
                        lineHeight: "16px"
                      }}>
                      <ReadMoreMaster
                        byWords={true}
                        length={10}
                        ellipsis="...">{props.value}
                      </ReadMoreMaster>
                    </Box>
            }
          },
          {
            Header: 'Action',
            Cell: props => {
                let {_id, description} = props.row.original
                return  <div className="Btn--posts">
                            <Link to={`/phone/${_id}/edit`}><button><EditIcon/>{t("edit")}</button></Link>
                            <button onClick={(e)=>{
                              setOpenDialogDelete({ isOpen: true, id: _id, description });
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
  //////////////////////

  return (<div className="pl-2 pr-2">
            <Box style={{ flex: 4 }} className="table-responsive">
              {
                phonesValue.loading
                ? <div><CircularProgress /></div> 
                : <Table
                    columns={columns}
                    data={phonesValue.data.phones.data}
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

              {lightbox.isOpen && (
                <Lightbox
                  mainSrc={lightbox.images[lightbox.photoIndex].base64}
                  nextSrc={lightbox.images[(lightbox.photoIndex + 1) % lightbox.images.length].base64}
                  prevSrc={
                    lightbox.images[(lightbox.photoIndex + lightbox.images.length - 1) % lightbox.images.length].base64
                  }
                  onCloseRequest={() => {
                    setLightbox({ ...lightbox, isOpen: false });
                  }}
                  onMovePrevRequest={() => {
                    setLightbox({
                      ...lightbox,
                      photoIndex:
                        (lightbox.photoIndex + lightbox.images.length - 1) % lightbox.images.length
                    });
                  }}
                  onMoveNextRequest={() => {
                    setLightbox({
                      ...lightbox,
                      photoIndex: (lightbox.photoIndex + 1) % lightbox.images.length
                    });
                  }}
                />
              )}

              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClick={(e)=>{
                  history.push({ pathname: "/phone/new", state: {from: "/"} });
                }}>
                {/* {
                  _.map([
                          { icon: <AddIcCallIcon />, name: 'Phone', id: 2 },
                        ], (action) => (
                          <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={(e)=>{
                              switch(action.id){
                                // case 1:{
                                //   history.push({ pathname: "/post/new", state: {from: "/"} });
                                //   break;
                                // }

                                case 2:{
                                  history.push({ pathname: "/phone/new", state: {from: "/"} });
                                  break;
                                }
                              }
                            }}
                          />
                        ))
                } */}
                
              </SpeedDial>
            </Box>
          </div>);
};

const mapStateToProps = (state, ownProps) => {
  return {user: state.auth.user}
};

export default connect( mapStateToProps, null )(PhoneList);
