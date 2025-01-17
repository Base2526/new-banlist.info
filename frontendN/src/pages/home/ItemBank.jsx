import React, { useState, useEffect, withStyles } from "react";
import Typography from "@mui/material/Typography";
import { useQuery } from "@apollo/client";
import _ from "lodash"

import { gqlBanks } from "../../gqlQuery"
import { getHeaders } from "../../util"

const ItemBank = (props) => {
    let {item} = props 

    let valueBanks = useQuery(gqlBanks, { 
                                context: { headers: getHeaders() }, 
                                notifyOnNetworkStatusChange: true 
                            });
    
    if(valueBanks.loading){
        return <div />
    }

    let bank = _.find(valueBanks.data.banks.data, (v) => v._id === item.bankId)
    return <li><Typography variant="subtitle2" color="textSecondary">{item.bankAccountName} [{bank === null ? "" : bank.name}]</Typography></li>
};

export default ItemBank;
