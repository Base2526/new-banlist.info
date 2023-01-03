import React, { useState, useEffect, useRef} from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { connect } from "react-redux";
import { bindActionCreators, compose } from 'redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
  useLocation
} from "react-router-dom";

import _ from "lodash";
import { useQuery, useApolloClient } from "@apollo/client";
import ReactGA4 from "react-ga4";

import Store from "./Store";
import Detail from "./pages/detail/Detail"
import Breadcs from "./components/breadcrumbs/Breadcs";
import HomePage from "./pages/home/HomePage";
import MyAppBar from "./MyAppBar";
import LeftMenu from "./LeftMenu"
import PrivateRoute from "./PrivateRoute"
import PrivatePage from "./PrivatePage"
import UserView from "./pages/user/UserView";
import DialogLogin from "./DialogLogin";
import Help from "./pages/help"
import Pdpa from "./pages/basicContent/Pdpa"
import DeveloperPage from "./pages/basicContent/Developer"
import PrivacyAndTermsPage from "./pages/basicContent/PrivacyAndTerms"
import LoginPage from "./pages/auth/Login"
import Footer from "./pages/footer"
import DialogTermsAndConditions from "./DialogTermsAndConditions"
import i18n from './translations/i18n';
import { login, addedConversations, addedConversation, addedNotifications, addedNotification, termsAndConditions } from "./redux/actions/auth"
import {  gqlConversations, 
          subConversation, 
          gqlNotifications, 
          subNotification,
          gqlPing } from "./gqlQuery"

import { getHeaders } from "./util"

let unsubscribeConversation = null;
let unsubscribeNotification = null;

const drawerWidth = 220;

const styles = (theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(0deg)"
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(180deg)"
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9 + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing.unit,
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  grow: {
    flexGrow: 1
  }
});

const App = (props) => {
 
  let {is_connnecting, user, terms_and_conditions, addedConversations, addedConversation, addedNotifications, addedNotification, termsAndConditions} = props

  const history = useHistory();
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const client = useApolloClient();
  const intervalPing = useRef(null);

  const [dialogLoginOpen, setDialogLoginOpen] = useState(false);

  const [dialogTermsAndConditions, setDialogTermsAndConditions] = useState(false);

  /////////////////////// ping ///////////////////////////////////
  const pingValues =useQuery(gqlPing, { context: { headers: getHeaders() }, notifyOnNetworkStatusChange: true});

  
  ////////////////////// conversation ////////////////////////////
  const conversationValues =useQuery(gqlConversations, { context: { headers: getHeaders() },  notifyOnNetworkStatusChange: true });

  // console.log("conversationValues :", conversationValues )
    
  // react-ga4
  ReactGA4.send({ hitType: "pageview", page: window.location.pathname });


  i18n.changeLanguage( _.isEmpty(localStorage.getItem('i18n')) ? "en" : localStorage.getItem('i18n') );

  if( !conversationValues.loading && conversationValues.data.conversations){
    let { status, data } = conversationValues.data.conversations  
    addedConversations(data)
  
    let {subscribeToMore} = conversationValues
    unsubscribeConversation = subscribeToMore({
      document: subConversation,
      // variables: { userId: user._id },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;

        let { subConversation } = subscriptionData.data;
        addedConversation(subConversation)

        return prev;
      }
    });
  }

  ////////////////////// conversation ////////////////////////////

  //////////////////////  notifications //////////////////////////////////
  const notificationValues =useQuery(gqlNotifications, { context: { headers: getHeaders() },  notifyOnNetworkStatusChange: true });

  // console.log("notificationValues :", notificationValues )

  if(  is_connnecting && !notificationValues.loading && notificationValues.data.notifications ){
    
    let { status, data } = notificationValues.data.notifications  
    addedNotifications(data)
  
    let {subscribeToMore} = notificationValues
    unsubscribeNotification = subscribeToMore({
      document: subNotification,
      // variables: { userId: user._id },
      updateQuery: (prev, {subscriptionData}) => {

           
        if (!subscriptionData.data) return prev;

        let { subNotification } = subscriptionData.data;
        addedNotification(subNotification)
        console.log("addedNotification : ", subNotification)     

        return prev;
      }
    });
  }
  //////////////////////  notifications //////////////////////////////////

  const [onlineIndicator, setOnlineIndicator] = useState(0);
  const worker = (user) => {
    if(!_.isEmpty(user)){
      pingValues && pingValues.refetch()

      console.log("ping : auth")
    }else{
      console.log("ping : not auth")
    }
    
    console.log("worker :", new Date().toISOString())
  }

  useEffect(async () => {
    // worker(user)

    // setOnlineIndicator(setInterval(() => worker(user), 20000, user));

    return () => {
      // Clean up
      clearInterval(onlineIndicator);

      unsubscribeConversation && unsubscribeConversation()

      unsubscribeNotification && unsubscribeNotification()
    };
  }, [])

  useEffect(()=>{
    conversationValues.refetch()

    notificationValues.refetch()

    // setOnlineIndicator(setInterval(() => worker(user), 20000, user));
  }, [user])

  useEffect(()=> {
    intervalPing.current = setInterval(() => {
      if(!_.isEmpty(user)){
        pingValues && pingValues.refetch()
  
        console.log("ping : auth")
      }else{
        console.log("ping : not auth")
      }
    }, 20000);
    return ()=> clearInterval(intervalPing.current);
  }, [user]);

  const handleDrawerOpen = () => {
    setOpen(!open)
  };

  const NoMatch = () =>{
    let location = useLocation();

    return (
      <div>
        <h3>
          Page not found !!! <code>{location.pathname}</code>
        </h3>
      </div>
    );
  }

  return (
    <Router>
      <Store>
        <div className={props.classes.root}>
          <CssBaseline />
          <MyAppBar 
            classes={props.classes} 
            open={open}
            onDrawerOpen={
              handleDrawerOpen
            }
            handleMenu={(e)=>{
              console.log("handleMenu")
            }}
            handleClose={(e)=>{
              
            }}
            onDialogLogin={(status)=>{
              setDialogLoginOpen(status)
            }}
          />
          <Drawer
            variant="permanent"
            className={classNames(props.classes.drawer, {
              [props.classes.drawerOpen]: open,
              [props.classes.drawerClose]: !open
            })}
            classes={{
              paper: classNames({
                [props.classes.drawerOpen]: open,
                [props.classes.drawerClose]: !open
              })
            }}
            open={open}>
            <div className={props.classes.toolbar} />
            <LeftMenu  {...props}/>
          </Drawer>
          <main className={props.classes.content}>
            <div className={props.classes.toolbar} />
            <Breadcs title={""} />
            <div className="container">
               <div className="row">
                <Switch>
                  <Route path="/" exact>
                    <div className="page-home">
                      <HomePage />
                    </div>
                  </Route>
                  <Route path="/user/login">
                    <LoginPage />
                  </Route>
                  <Route path="/detail/:id">
                    <div className="page-detail">
                      <Detail/>
                    </div>
                  </Route>
                  <Route path="/user/:id/view">
                    <div className="page-view">
                      <UserView />
                    </div>
                  </Route>
                  <Route path="/help">
                    <div className="page-help pl-2 pr-2">
                      <Help />
                    </div>
                  </Route>
                  <Route path="/privacy+terms">
                    <div className="page-terms pl-2 pr-2">
                      <PrivacyAndTermsPage />
                    </div>
                  </Route>
                  <Route path="/developer">
                    <div className="page-dev pl-2 pr-2">
                      <DeveloperPage />
                    </div>
                  </Route>

                  {/*  */}
                  <Route path="/pdpa">
                    <div className="page-dev pl-2 pr-2">
                      <Pdpa />
                    </div>
                  </Route>
                  
                  <PrivateRoute path="/">
                    <PrivatePage />
                  </PrivateRoute>   
                  <Route path="*">
                    <NoMatch />
                  </Route>     
                </Switch>
               </div>
            </div>
            <div className="footer"><Footer /></div>
          </main>
        </div>

        {
          dialogLoginOpen &&  
          <DialogLogin
            {...props}
            open={dialogLoginOpen}
            onComplete={async(data)=>{
              setDialogLoginOpen(false);
              props.login(data)

              await client.cache.reset();
              await client.resetStore();
              history.push("/")
            }}
            onClose={() => {

              console.log(">>>> ")
              setDialogLoginOpen(false);
            }}
          />
        }

        {
          // dialogTermsAndConditions && 
          <DialogTermsAndConditions 
            open={!terms_and_conditions}
            onOK={()=>{
              termsAndConditions(true)
            }}/>
        }
      </Store>
    </Router>
  );
}

// export default withStyles(styles, { withTheme: true })(App);
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    is_connnecting: state.ws.is_connnecting,
    terms_and_conditions: state.auth.terms_and_conditions
  }
};

const mapDispatchToProps = {
  login,
  addedConversations,
  addedConversation,
  addedNotifications, 
  addedNotification,
  termsAndConditions
}

export default compose(
                        connect(
                          mapStateToProps,
                          mapDispatchToProps, // or put null here if you do not have actions to dispatch
                        ),
                        withStyles(styles , { withTheme: true }),
                      )(App);