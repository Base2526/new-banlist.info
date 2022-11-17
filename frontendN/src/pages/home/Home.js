import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import HomeItem from "./HomeItem";
import Masonry from "react-masonry-css";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useHistory } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import _ from "lodash";
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { connect } from "react-redux";
import IconButton from "@mui/material/IconButton";
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import queryString from 'query-string';

import PanelComment from "./PanelComment";
import PopupSnackbar from "./PopupSnackbar";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import DialogLogin from "../../DialogLogin";
import ReportDialog from "../../components/report"
import DialogProfile from "../../components/dialogProfile"
import {gqlHomes, gqlCreateReport, 
        gqlCreateShare, gqlCurrentNumber, 
        subPost, gqlCreateAndUpdateBookmark, 
        gqlIsBookmark} from "../../gqlQuery"

import { login, addedBookmark } from "../../redux/actions/auth"

let unsubscribePost = null;

const Home = (props) => {
  let history = useHistory();

  let params = queryString.parse(history.location.search)

  // console.log("Home :", params)

  let { is_connnecting, user, addedBookmark } = props

  const [keywordSearch, setKeywordSearch] = useState("");
  const [category, setCategory] = useState([0,1]);
  const [page, setPage] = useState( _.isEmpty(params) ? 0 : params?.page ? params.page : 0 );                             // Page number
  const [rowsPerPage, setRowsPerPage] = useState( _.isEmpty(params) ? 30 : params?.perPage ? params.perPage : 30 );              // Number per page
  const [dialogLoginOpen, setDialogLoginOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ isOpen: false, photoIndex: 0, images: [] });
  const [panelComment, setPanelComment] = useState({ isOpen: false, commentId: "" });
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const [anchorElShare, setAnchorElShare] = useState(null);
  const [snackbar, setSnackbar] = useState({open: false, message:""});
  const [report, setReport] = useState({open: false, postId:""});

  const [dialogProfile, setDialogProfile] = useState({open: false, id:""});
  const breakpoints = { default: 3, 1100: 2, 700: 1 };

  const [onCreateReport, resultCreateReportValues] = useMutation(gqlCreateReport
    , {
        onCompleted({ data }) {
          history.push("/");
        }
      }
  );

  const [onCreateShare, resultCreateShare] = useMutation(gqlCreateShare, {
    onCompleted({ data }) {
      // history.push("/");
    }
  });
  // console.log("resultCreateShare :", resultCreateShare)
    
  const [onCreateAndUpdateBookmark, resultCreateAndUpdateBookmarkValues] = useMutation(gqlCreateAndUpdateBookmark
    , {
        update: (cache, {data: {createAndUpdateBookmark}}) => {
          let {userId, postId} = createAndUpdateBookmark
          const data1 = cache.readQuery({
              query: gqlIsBookmark,
              variables: { userId, postId }
          });

          let newData = {...data1.isBookmark}
          newData = {...newData, data: createAndUpdateBookmark}

          cache.writeQuery({
              query: gqlIsBookmark,
              data: {
                isBookmark: newData
              },
              variables: {userId, postId }
          });     
        },
        onCompleted({ data }) { },
      },  
  );
  
  const homesValues =useQuery(gqlHomes, {
    variables: { userId: "", page, perPage: rowsPerPage, keywordSearch: keywordSearch, category: category.join()},
    notifyOnNetworkStatusChange: true,
  });
  // console.log("homesValues :", homesValues )

  if( is_connnecting && !homesValues.loading){

    // console.log("homesValues.data.homes.data :", homesValues, page, rowsPerPage)

    if(_.isEmpty(homesValues.data.homes)){
      return;
    }

    var keys = _.map(homesValues.data.homes.data, _.property("id"));

    let {subscribeToMore} = homesValues
    unsubscribePost && unsubscribePost()
    unsubscribePost =  subscribeToMore({
			document: subPost,
      variables: { postIDs: JSON.stringify(keys) },
			updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;

        let { mutation, data } = subscriptionData.data.subPost;

        let prevData = prev.homes.data
        let newData = _.map(prevData, (o)=>{
                        if(o.id === data.id) return data
                        return o 
                      })

        let newPrev = {...prev.homes, data: newData}
        return newPrev;
			}
		});
  }

  useEffect(()=>{
    if(is_connnecting){
      homesValues && homesValues.refetch({userId: _.isEmpty(user) ? "" : user._id, page, perPage: rowsPerPage, keywordSearch: keywordSearch, category: category.join()})
    }
  }, [user, is_connnecting])

  const handleAnchorElSettingOpen = (index, event) => {
    setAnchorElSetting({ [index]: event.currentTarget });
  };

  const handleAnchorElSettingClose = () => {
    setAnchorElSetting(null);
  };

  const handleAnchorElShareOpen = (index, event) => {
    setAnchorElShare({ [index]: event.currentTarget });
  };

  const handleAnchorElShareClose = () => {
    setAnchorElShare(null);
  };

  const menuShare = (item, index) =>{

    return  <Menu
              anchorEl={anchorElShare && anchorElShare[index]}
              keepMounted
              open={anchorElShare && Boolean(anchorElShare[index])}
              onClose={(e)=>handleAnchorElShareClose()}
              // onClose={()=>{
              //     console.log("Menu onClose")
              // }}
              // getContentAnchorEl={null}
              anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
              }}
              transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
              }}
              MenuListProps={{
                  "aria-labelledby": "lock-button",
                  role: "listbox"
              }}
              >
              <MenuItem onClose={(e)=>handleAnchorElShareClose()}>
                 {/* <div onClick={(e)=>{

                    if(_.isEmpty(user)){
                      setDialogLoginOpen(true)
                    }else{
                      // onCreateShare({ variables: { input: {
                      //       postId: item.id,
                      //       userId: user._id,
                      //       destination: "facebook"
                      //     }
                      //   }
                      // });  
                    }
                    handleAnchorElShareClose()
                  }}>
                    <FacebookIcon size={32} round /> Facebook
                  </div> */}

                  <FacebookShareButton
                    url={ window.location.href + "detail/" + item._id}
                    quote={item?.title}
                    // hashtag={"#hashtag"}
                    description={item?.description}
                    className="Demo__some-network__share-button"
                    onClick={(e)=>{ handleAnchorElShareClose() }} >
                    <FacebookIcon size={32} round /> Facebook
                  </FacebookShareButton>
              </MenuItem>{" "}

              <MenuItem onClose={(e)=>handleAnchorElShareClose()}>
                <TwitterShareButton
                  title={item?.title}
                  url={ window.location.origin + "/detail/" + item._id }
                  // hashtags={["hashtag1", "hashtag2"]}
                  onClick={(e)=>{ handleAnchorElShareClose() }} >
                  <TwitterIcon size={32} round />
                  Twitter
                </TwitterShareButton>
              </MenuItem>

              <MenuItem 
              onClick={async(e)=>{
                let text = window.location.href + "detail/" + item._id
                if ('clipboard' in navigator) {
                  await navigator.clipboard.writeText(text);
                } else {
                  document.execCommand('copy', true, text);
                }

                handleAnchorElShareClose()
              }}>
                
              <ContentCopyIcon size={32} round /> Copy link
              </MenuItem>
            </Menu>
  }

  const menuSetting = (item, index) =>{
    
    return  <Menu
              anchorEl={anchorElSetting && anchorElSetting[index]}
              keepMounted
              open={anchorElSetting && Boolean(anchorElSetting[index])}
              onClose={handleAnchorElSettingClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
              MenuListProps={{
                "aria-labelledby": "lock-button",
                role: "listbox"
              }}
            >
              {
                !_.isEmpty(user) && user._id == item.ownerId
                ? <MenuItem onClick={(e)=>{
                    handleAnchorElSettingClose()
                    history.push("/post/"+item._id+ "/edit");
                  }}>
                    Edit
                  </MenuItem>
                : <div /> 
              }
              
              <MenuItem onClick={(e)=>{
                handleAnchorElSettingClose()
                if(_.isEmpty(user)){
                  setDialogLoginOpen(true)
                }else{
                  setReport({open: true, postId:item.id})
                }
              }}>
                Report
              </MenuItem>
            </Menu>
  }

  const main = () =>{

    // console.log("homesValues.data :", homesValues.data)
    return  <div>
              <Container>
                <Masonry
                  breakpointCols={breakpoints}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {homesValues.data.homes.data.map(
                    (item, index) => {
                      return (
                        <div key={item.id}>
                          <HomeItem 
                            {...props}
                            user={user}
                            item={item} 
                            index={index} 
                            onPanelComment={(data)=>{
                              setPanelComment(data)
                            }}
                            onLightbox={(data)=>{
                              setLightbox(data)
                            }}
                            onAnchorElShareOpen={(index, e)=>{
                              handleAnchorElShareOpen(index, e)
                            }}
                            onAnchorElSettingOpen={(index, e)=>{
                              handleAnchorElSettingOpen(index, e)
                            }}
                            onDialogProfileOpen={(index, e)=>{
                              setDialogProfile({open:true, id:e.ownerId})
                            }}
                            onDialogLogin={(status)=>{
                              setDialogLoginOpen(status)
                            }}
                            onBookmark={(postId, userId, status)=>{

                              console.log("onCreateAndUpdateBookmark :", postId, userId, status)
                              onCreateAndUpdateBookmark({ variables: { input: {
                                    postId,
                                    userId,
                                    status
                                  }
                                }
                              }); 

                              // addedBookmark({postId, userId, status})
                            }}
                            />
                            {menuShare(item, index)}
                            {menuSetting(item, index)}
                        </div>
                      );
                    }
                  )}
                </Masonry>
              </Container>
              <Container sx={{ py: 2 }} maxWidth="xl">

                { 
                  homesValues.data.homes.total > rowsPerPage 
                  ? <Pagination
                      page={page}
                      onPageChange={(event, newPage) => {
                        setPage(newPage);
                        history.push({
                          pathname: "/",
                          search: "?page=" + newPage + "&perPage=" + rowsPerPage
                        });
                      }}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);

                        history.push({
                          pathname: "/",
                          search: "?perPage=" + parseInt(event.target.value, 10)
                        });
                      }}
                      count={homesValues.data.homes.total}
                    /> 
                  : <div /> 
                }
              </Container>
            </div>
  }

  return (
    <div style={{flex:1}}>
      <div>
        <SearchBar
          keyword={keywordSearch}
          onSearch={(data, topic)=>{
            setCategory(_.filter(topic, (v)=>v.checked).map((v)=>v.key))
            setKeywordSearch(data);
          }}
        />

        <div>
          {
            homesValues.loading || homesValues.data.homes == undefined
            ? is_connnecting ? <div><CircularProgress /></div> : <div>Server is down</div>
            : main()
          }
        </div>
        {/* <Footer /> */}
      </div>

      {snackbar.open && (
        <PopupSnackbar
          isOpen={snackbar.open}
          message={snackbar.message}
          onClose={() => {
            setSnackbar({...snackbar, open: false});
          }}
        />
      )}

      {panelComment.isOpen && (
        <PanelComment
          {...props}
          // user={user}
          commentId={panelComment.commentId}
          isOpen={panelComment.isOpen}
          onRequestClose={() => {
            let newPanelComment = { ...panelComment, isOpen: false };
            setPanelComment(newPanelComment);
          }}
          onSignin={(e)=>{
            setDialogLoginOpen(true);
          }}
        />
      )}

      {lightbox.isOpen && (
        <Lightbox
          mainSrc={lightbox.images[lightbox.photoIndex].url}
          nextSrc={lightbox.images[(lightbox.photoIndex + 1) % lightbox.images.length].url}
          prevSrc={
            lightbox.images[(lightbox.photoIndex + lightbox.images.length - 1) % lightbox.images.length].url
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
          // imageCaption={"imageCaption"}
          // imageTitle={"imageTitle"}
        />
      )}

      {dialogLoginOpen && (
        <DialogLogin
          {...props}
          open={dialogLoginOpen}
          onComplete={(data)=>{
            console.log("onComplete :", data)

            // props.login(data)
            setDialogLoginOpen(false);
          }}
          onClose={() => {
            setDialogLoginOpen(false);

            history.push("/")
          }}
        />
      )}

      {report.open && <ReportDialog 
                        open={report.open} 
                        postId={report.postId} 
                        onReport={(e)=>{
                          onCreateReport({ variables: { input: {
                                  userId: user._id,
                                  postId: e.postId,     
                                  categoryId: e.categoryId,
                                  description: e.description
                                } 
                              } 
                          });

                          setReport({open: false, postId:""})
                        }}

                        onClose={()=>setReport({open: false, postId:""})}/>
      }

      {dialogProfile.open &&  <DialogProfile 
                                open={dialogProfile.open} 
                                id={dialogProfile.id} 
                                onClose={()=>setDialogProfile({open: false, id:""})}/>
      }

      {
        !_.isEmpty(user)
        ? <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}>
            {
              _.map([
                      { icon: <PostAddIcon />, name: 'Post', id: 1 },
                      { icon: <AddIcCallIcon />, name: 'Phone', id: 2 },
                    ], (action) => (
                      <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={(e)=>{
                          switch(action.id){
                            case 1:{
                              history.push({ pathname: "/post/new", state: {from: "/"} });
                              break;
                            }

                            case 2:{
                              history.push({ pathname: "/phone/new", state: {from: "/"} });
                              break;
                            }
                          }
                        }}
                      />
                    ))
            }
            </SpeedDial>
        : <div />
      }
      
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    bookmarks: state.auth.bookmarks,
    is_connnecting: state.ws.is_connnecting
  }
};

const mapDispatchToProps = {
  login,
  addedBookmark
}

export default connect( mapStateToProps, mapDispatchToProps )(Home);