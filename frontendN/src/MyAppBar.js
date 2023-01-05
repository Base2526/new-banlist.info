import React, { useEffect, useState } from "react";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';
import styled from "styled-components";
import classNames from "classnames";
import Button from "@mui/material/Button";
import { NotificationsNone, AccountCircle, Comment as CommentIcon } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem} from "@material-ui/core";

import { connect } from "react-redux";
import _ from "lodash"
import { useTranslation } from "react-i18next";

import i18n from './translations/i18n';
import {getCurrentLanguage} from "./util"

export const TopRight = styled.div`
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 10px;
  color: #eee;
`;

export const TopIconBadge = styled.span`
  position: absolute;
  top: -5px;
  right: 1px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

const MyAppBar = (props) =>{

  const { t } = useTranslation();

  const [language, setLanguage] = useState('en');

  let {conversations, classes, onDrawerOpen, onDialogLogin, user, notifications, open} = props

  let history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null)
  let [conversationsBadge, setConversationsBadge] = useState(0)

  useEffect(()=>{
    let countBadge = 0;
    _.map(conversations, conversation=>{
      let member = _.find( conversation.members, member => member.userId === user._id );
      if(!_.isEmpty(member)) countBadge += member.unreadCnt
    })
    setConversationsBadge(countBadge)
  }, [conversations])

  const handleClose = () =>{
    setAnchorEl(null)
  }

  const handleChangeLanguage=(e)=>{
    e.preventDefault();
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);

    localStorage.setItem('i18n', e.target.value);
  }

  return  <AppBar
            position="fixed"
            className={classes.appBar}
            fooJon={classNames(classes.appBar, {
              [classes.appBarShift]: Boolean(anchorEl)
            })}>
            <Toolbar disableGutters={true}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerOpen}
                className={classes.menuButton}
              >
                {/* <MenuIcon
                  classes={{
                    root: Boolean(anchorEl)
                      ? classes.menuButtonIconOpen
                      : classes.menuButtonIconClosed
                  }}
                /> */}

                {
                  open
                  ? <MenuOpenIcon classes={{ root: classes.menuButtonIconOpen }} />
                  : <MenuIcon classes={{ root: classes.menuButtonIconClosed }} />
                }
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.grow}
                onClick={(e)=>history.push("/")}>
                BANLIST.INFO
              </Typography>

              
              <div style={{"marginRight": "10px"}} className="lang-contain">
                <button value='en' onClick={handleChangeLanguage} className={(getCurrentLanguage() == "en" ? "lang-en active" : "lang-en")}> EN </button>
                <button value='th' onClick={handleChangeLanguage} className={(getCurrentLanguage() == "th" ? "lang-en active" : "lang-en")}> TH </button>
              </div>
              
              {
                !_.isEmpty(user)
                ? <TopRight>
                    <Link to="/notification">
                      <IconContainer >
                        <NotificationsNone />
                        {_.isEmpty(notifications) ? "" : <TopIconBadge>{notifications.length}</TopIconBadge>}
                      </IconContainer>
                    </Link>

                    {
                      !_.isEmpty(conversations)  && <Link to="/message">
                                                      <IconContainer>
                                                        <CommentIcon />
                                                        
                                                        { conversationsBadge === 0 ? "" : <TopIconBadge>{conversationsBadge}</TopIconBadge>}
                                                      </IconContainer>
                                                    </Link>
                    }
                    
                    <IconContainer>
                      <IconButton
                        aria-owns={Boolean(anchorEl) ? "menu-appbar" : undefined}
                        aria-haspopup="true"
                        onClick={(event)=>{
                          setAnchorEl(event.currentTarget)
                        }}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right"
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                          <MenuItem onClick={()=>{
                            history.push("/me")
                            handleClose()
                          }}>{t("profile")}</MenuItem>
                      </Menu>
                    </IconContainer>
                   
                  </TopRight>
                : <Button 
                    style={{marginRight:"10px"}} 
                    variant="contained" 
                    color="primary"
                    onClick={(e)=>{
                      onDialogLogin(true)

                      // localStorage.setItem('token', data.login.token)

                      // if(localStorage.getItem('token')){
                      //   console.log("A")
                      //   // localStorage.setItem('token', "")
                      //   localStorage.removeItem("token");
                      // }else{
                      //   console.log("B")
                      //   localStorage.setItem('token', "data.login.token")
                      // }
                    }}>
                      <AccountCircle  />
                      {t("login")} 
                    </Button>
              }
            </Toolbar>
          </AppBar>
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    conversations: state.auth.conversations,
    notifications: state.auth.notifications
  }
};

export default connect( mapStateToProps, null )(MyAppBar);