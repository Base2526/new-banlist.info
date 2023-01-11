import "./Detail.css"

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, Typography, makeStyles } from "@material-ui/core";
import moment from "moment";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);
import { useTranslation } from "react-i18next";

import { gqlPost, gqlCreateAndUpdateBookmark, 
        gqlIsBookmark, gqlCreateAndUpdateComment, 
        gqlComment, gqlCreateShare, 
        gqlShareByPostId,
        subShare } from "../../gqlQuery"

import DialogLogin from "../../DialogLogin";
import { login } from "../../redux/actions/auth"

import ItemBank from "./ItemBank"
import ItemComment from "./ItemComment"
import ItemBookmark from "./ItemBookmark"

import ReportDialog from "../../components/report"

import {convertDate, numberCurrency} from "../../util"

// import {wsLink} from "../../Apollo"

let unsubscribe =null
const Detail = (props) => {
    let history = useHistory();
    const { t } = useTranslation();

    let { pathname } = useLocation();
    let { id } = useParams();
    let { user, login } = props

    const [anchorElShare, setAnchorElShare] = useState(null);
    const [anchorElSetting, setAnchorElSetting] = useState(null);
    const [dialogLoginOpen, setDialogLoginOpen] = useState(false);

    const [report, setReport] = useState({open: false, postId:""});

    useEffect(()=>{
        return () => {
          unsubscribe && unsubscribe()
        };
    }, [])

    const handleAnchorElSettingOpen = (index, event) => {
        setAnchorElSetting(event.currentTarget);
    };

    const handleAnchorElSettingClose = () => {
        setAnchorElSetting(null);
    };
    
    const [lightbox, setLightbox] = useState({
        isOpen: false,
        photoIndex: 0,
        images: []
    });

    const [onCreateAndUpdateBookmark, resultCreateAndUpdateBookmarkValues] = useMutation(gqlCreateAndUpdateBookmark
        , {
            update: (cache, {data: {createAndUpdateBookmark}}) => {
              const data1 = cache.readQuery({
                query: gqlIsBookmark,
                variables: {
                  postId: id
                }
              });
    
              let newData = {...data1.isBookmark}
              newData = {...newData, data: createAndUpdateBookmark}
            
              cache.writeQuery({
                query: gqlIsBookmark,
                data: {
                  isBookmark: newData
                },
                variables: {
                  postId: id
                }
              });
            },
            onCompleted({ data }) {
              // console.log("bookmark :::: onCompleted")
            },
          },  
    );
    // console.log("resultCreateAndUpdateBookmarkValues :", resultCreateAndUpdateBookmarkValues)

    const [onCreateComment, resultCreateComment] = useMutation(gqlCreateAndUpdateComment, 
      {
          update: (cache, {data: {createAndUpdateComment}}) => {
              const data1 = cache.readQuery({
                  query: gqlComment,
                  variables: {postId: id}
              });
  
              let newData = {...data1.Comment}
              newData = {...newData, data: createAndUpdateComment.data}
                  
              cache.writeQuery({
                  query: gqlComment,
                  data: {
                      Comment: newData
                  },
                  variables: {
                      postId: id
                  }
              });
          },
          onCompleted({ data }) {
              // console.log("onCompleted")
          }
      }
    );

    const [onCreateShare, resultCreateShare] = useMutation(gqlCreateShare, {
        onCompleted({ data }) {
          // history.push("/");
        }
      });
    //   console.log("resultCreateShare :", resultCreateShare)
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    let postValue = useQuery(gqlPost, {
        variables: {id: id},
        notifyOnNetworkStatusChange: true,
    });

    let shareValues = useQuery(gqlShareByPostId, {
        variables: {postId: id},
        notifyOnNetworkStatusChange: true,
    });
    // console.log("shareValues :", shareValues)

    if(!shareValues.loading){
        let {subscribeToMore} = shareValues
        unsubscribe =  subscribeToMore({
            document: subShare,
            variables: { postId: id },
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) return prev;

                let { mutation, data } = subscriptionData.data.subShare;
                let newPrev = {...prev.shareByPostId, data:_.uniqBy([...prev.shareByPostId.data, data], 'id')}  
                return {shareByPostId: newPrev}; 
            }
        });
    }

    const menuShare = (item) =>{
        return  <Menu
                  anchorEl={anchorElShare}
                  keepMounted
                  open={anchorElShare}
                  onClose={(e)=>{
                    setAnchorElShare(null);
                  }}
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
                    <MenuItem onClose={(e)=>setAnchorElShare(null)}>
                    <FacebookShareButton
                        url={ window.location.origin + "/detail/" + item._id}
                        quote={item?.title}
                        // hashtag={"#hashtag"}
                        description={item?.description}
                        className="Demo__some-network__share-button"
                        onClick={(e)=>{setAnchorElShare(null); }} >
                        <FacebookIcon size={32} round /> Facebook
                    </FacebookShareButton>
                    </MenuItem>{" "}
                    <MenuItem onClose={(e)=>setAnchorElShare(null)}>
                        <TwitterShareButton
                        title={item?.title}
                        url={ window.location.origin + "/detail/" + item._id }
                        // hashtags={["hashtag1", "hashtag2"]}
                        onClick={(e)=>{ setAnchorElShare(null); }} >
                        <TwitterIcon size={32} round />
                        Twitter
                        </TwitterShareButton>
                    </MenuItem>
                    <MenuItem 
                        onClick={async(e)=>{
                        let text = window.location.origin + "/detail/" + item._id
                        if ('clipboard' in navigator) {
                            await navigator.clipboard.writeText(text);
                        } else {
                            document.execCommand('copy', true, text);
                        }

                        setAnchorElShare(null);
                        }}>
                        <ContentCopyIcon size={32} round /> Copy link
                    </MenuItem>
                </Menu>
    }

    const menuSetting = (item) =>{
        return  <Menu
                  anchorEl={anchorElSetting}
                  keepMounted
                  open={anchorElSetting && Boolean(anchorElSetting)}
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

                  <MenuItem onClick={(e)=>{
                    handleAnchorElSettingClose()
    

                    _.isEmpty(user)
                    ? setDialogLoginOpen(true)    
                    : setReport({open: true, postId:item._id})
                    
                  }}>
                    {t('report')}
                  </MenuItem>
                </Menu>

    
    }

    const mainView = () =>{

        if(_.isEmpty(postValue.data)){
            return <div />
        }

        let post = postValue.data.post.data
        return  <div className="col-container">
                    <div className="col1">
                        {
                            _.isEmpty(post?.files) 
                            ?   <div />
                            :   <CardActionArea style={{ position: "relative", paddingBottom: "10px" }}>
                                    <CardMedia
                                        component="img"
                                        // height="194"
                                        image={  post.files[0].url }
                                        alt={ post.files[0].fileName }
                                        onClick={() => {
                                            setLightbox({ isOpen: true, photoIndex: 0, images:post.files })
                                        }}/>
                                    {post.files.length > 1 ?
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "15px",
                                            right: "5px",
                                            padding: "5px",
                                            backgroundColor: "#e1dede",
                                            borderRadius: "5px",
                                            margin: "5px",
                                            color: "#919191"
                                        }}
                                        >{post.files.length}</div>
                                    : <div />}
                                </CardActionArea>

                        }

                        
                    </div>
                    <div className="col2">
                        <div className="bg-white rounded border">
                            <div className="col3">
                                <div>
                                    <div>
                                        <ItemBookmark 
                                            {...props} 
                                            postId={id}
                                            onBookmark={(input)=>{
                                                onCreateAndUpdateBookmark({ variables: { input } }); 
                                            }}
                                            onDialogLogin={(e)=>{
                                                setDialogLoginOpen(true)
                                            }}/>
                                        <IconButton onClick={(e) => { 
                                            _.isEmpty(user)
                                            ? setDialogLoginOpen(true)    
                                            : setAnchorElShare(e.currentTarget) 
                                        }}>
                                            <ShareIcon />
                                            {  
                                                shareValues.loading 
                                                ? <div /> 
                                                : shareValues.data.shareByPostId.data.length == 0 ? <></> : <div style={{
                                                    position: "absolute",
                                                    right: "5px",
                                                    borderRadius: "5px",
                                                    borderStyle: "solid",
                                                    borderColor: "red",
                                                    borderWidth: "1px",
                                                    fontSize: "10px"
                                                    }}>{shareValues.data.shareByPostId.data.length}</div> 
                                            }
                                        </IconButton>
                                        <IconButton  onClick={(e) => { 
                                            _.isEmpty(user)
                                            ? setDialogLoginOpen(true)    
                                            : setAnchorElSetting(e.currentTarget) 
                                        }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                </div>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t("search_by_title")} : {post?.title}
                                </Typography>
                                <Typography
                                    style={{ cursor: "pointer" }}
                                    variant="subtitle2"
                                    color="textSecondary">
                                    {t("search_by_name_surname")} : {post?.nameSubname}
                                </Typography>
                        
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t("amount")} : {numberCurrency(post?.amount)}
                                </Typography>

                                <Typography variant="subtitle2" color="textSecondary">{t("search_by_tel")} : 
                                    <ul>
                                        {
                                            _.map(post.tels, (v)=>{
                                                return <li><Typography variant="subtitle2" color="textSecondary">{v}</Typography></li>
                                            })
                                        }
                                    </ul>
                                </Typography>

                                <Typography variant="subtitle2" color="textSecondary">{t("search_by_id_bank")} : 
                                    <ul>{_.map(post.banks, (v)=><ItemBank item={v}/>)}</ul>
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {t("date_tranfer")} : {convertDate(moment(post.dateTranfer).format('D MMM YYYY'))}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary" dangerouslySetInnerHTML={{ __html:  t("detail") + ": " + post.description}} />
                            </div>
                            <div className="col4">
                                <ItemComment 
                                    {...props}
                                    id={id}
                                    onComment={(input)=>{
                                        onCreateComment({ variables: { input: input }});
                                    }}
                                    onDialogLogin={()=>{
                                        setDialogLoginOpen(true)
                                    }}/>
                            </div>
                        </div>
                    </div>

                    {menuSetting(post)}

                    {menuShare(post)}
                </div>
    }

    return (
        <div>
            {
                postValue.loading
                ?   <CircularProgress />
                :   mainView()
            }

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
                    }}/>
            )}

            {dialogLoginOpen && (
                <DialogLogin
                {...props}
                open={dialogLoginOpen}
                onComplete={async(data)=>{
                    setDialogLoginOpen(false);
                    login(data)
                    
                    await client.cache.reset();
                    await client.resetStore();
                }}
                onClose={() => {
                    setDialogLoginOpen(false);
                }}
                />
            )}

            {report.open && <ReportDialog 
                                    open={report.open} 
                                    postId={report.postId} 
                                    onReport={(e)=>{
                                        setReport({open: false, postId:""})
                                    }}

                  
                                    onClose={()=>setReport({open: false, postId:""})}/>
            }
           
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
      user: state.auth.user,
    }
};

const mapDispatchToProps = {
    login
}

export default connect( mapStateToProps, mapDispatchToProps )(Detail);
