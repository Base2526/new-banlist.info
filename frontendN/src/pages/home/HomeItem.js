import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { IconButton, Typography, makeStyles } from "@material-ui/core";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import AbcOutlinedIcon from "@mui/icons-material/AbcOutlined";
import Avatar from "@material-ui/core/Avatar";
import { yellow, green, pink, blue } from "@material-ui/core/colors";
import CardMedia from "@mui/material/CardMedia";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardActionArea from "@material-ui/core/CardActionArea";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Divider from "@material-ui/core/Divider";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import moment from "moment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import CircularProgress from '@mui/material/CircularProgress';
import ShowMoreText from "react-show-more-text";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Masonry from "react-masonry-css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import _ from "lodash"
import { useTranslation } from "react-i18next";

import i18n from '../../translations/i18n';

import ReadMoreMaster from "../../utils/ReadMoreMaster"
import ItemComment from "./ItemComment"
import ItemBookmark from "./ItemBookmark"
import ItemShare from "./ItemShare"
import ItemHeader from "./ItemHeader"
import ItemBank from "./ItemBank"

import {convertDate, numberCurrency} from "../../util"

const useStyles = makeStyles({
  avatar: {
    backgroundColor: (item) => {
      if (item.category === "work") {
        return yellow[700];
      }
      if (item.category === "money") {
        return green[500];
      }
      if (item.category === "todos") {
        return pink[500];
      }
      return blue[500];
    }
  },
  icon: {
    position: "relative",
    top: 0,
    left: 0,
    float: "right"
  }
});

const HomeItem =(props) => {
  let { user, item, bookmarks, onLightbox, onBookmark } = props

  const classes = useStyles(item);
  const history = useHistory();

  const { t } = useTranslation();

  const [expand, setExpand] = useState(false);

  const renderMedia = (m) =>{
    if( !_.isEmpty(m.files) ){

        // console.log("renderMedia : ", m.files)
        return <CardActionArea
          style={{ position: "relative", paddingBottom: "10px" }}
        >
          <CardMedia
            component="img"
            height="194"
            image={ m.files[0].url }
            alt={ m.files[0].fileName }
            onClick={() => {
              onLightbox({ isOpen: true, photoIndex: 0, images:m.files })
            }}
          />
          
          {/*  */}
            {m.files.length > 1 ?
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
                  >{(_.filter(m.files, (v)=>v.url)).length}</div>
              : <div />}
        
        </CardActionArea>
    }else{
        return <div />
    }
  }

  return (
    <div>
      <Card elevation={1} className={classes.test}>
        <ItemHeader {...props} />
        <CardContent>
          <div>
            {renderMedia(item)}
            <CardActionArea style={{}}>
              <Accordion expanded={expand} >
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                        {t("search_by_title")} : {item.title}
                    </Typography>
                    
                    <Typography
                      style={{ cursor: "pointer" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {t("search_by_name_surname")} : {item.nameSubname}
                    </Typography>
              
                    <Typography variant="subtitle2" color="textSecondary">
                      {t("amount")} : {numberCurrency(item.amount)}
                    </Typography>

                  
                    <Typography variant="subtitle2" color="textSecondary">
                      {t("date_tranfer")} : {convertDate(moment(item.dateTranfer).format('D MMM YYYY'))}
                    </Typography>
                        
                    <ReadMoreMaster
                      label= {t("detail")}
                      parentClass={"read-more-master"}
                      byWords={true}
                      length={15}
                      readMore={t("see_more")}
                      readLess="See less" 
                      ellipsis="...">{item.description}</ReadMoreMaster>
                  </div>
                </AccordionSummary>
                <AccordionDetails>

                  <Typography variant="subtitle2" color="textSecondary">{t("search_by_tel")} : 
                    <ul>
                      {
                        _.map(item.tels, (v)=>{
                            return <li><Typography variant="subtitle2" color="textSecondary">{v}</Typography></li>
                        })
                      }
                    </ul>
                  </Typography>

                  <Typography variant="subtitle2" color="textSecondary">{t('search_by_id_bank')} : 
                    <ul>
                      {
                        _.map(item.banks, (v)=>{
                          return <ItemBank item={v}/>
                        })
                      }
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardActionArea>
          </div>
          <Divider light />
          <div>

            <ItemBookmark {...props} />
            <ItemShare {...props} />
            <ItemComment {...props}/>

            <IconButton onClick={(e) => {
              history.push("/detail/" + item._id);
            }}>
              <OpenInNewIcon /> 
            </IconButton>
            <IconButton onClick={(e) => {
              setExpand(!expand)
            }}>
              { expand ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeItem