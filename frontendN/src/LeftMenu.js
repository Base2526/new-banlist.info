import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import _ from "lodash"
import { connect } from "react-redux";
import { useHistory, useLocation  } from "react-router-dom";

import {  MenuAdministrator,
          MenuAuthenticated,
          MenuAnonymous
        } from "./MenuList";
import CustomizedListItem from "./CustomizedListItem";

const LeftMenu = (props) => {
  const menuL = () =>{
    let permissions = _.isEmpty(props.user) ? [] : props.user.roles;

    // console.log("LeftMenu :", permissions)

    let listMenu = MenuAnonymous
    if( permissions && ( permissions.includes("62a2ccfbcf7946010d3c74a6") || permissions.includes("62a2ccfbcf7946010d3c74a4") ) ){
      listMenu = MenuAuthenticated
    }
    if( permissions && permissions.includes("62a2ccfbcf7946010d3c74a2")){
      listMenu = MenuAdministrator
    }
    return  _.map(listMenu, (item)=> { 
      return <CustomizedListItem {...props} key={item.id} item={item} /> 
    })
  }

  return (
    <List>
      {menuL()}
    </List>
  )
};

const mapStateToProps = (state, ownProps) => {
  // console.log("mapStateToProps  :", state)
  return {
    user: state.auth.user,
  }
};

export default connect( mapStateToProps, null )(LeftMenu);