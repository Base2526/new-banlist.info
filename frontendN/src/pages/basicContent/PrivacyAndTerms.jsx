import React , {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import Typography from "@material-ui/core/Typography";
import {gqlBasicContent} from "../../gqlQuery"

const PrivacyAndTerms = (props) => {
    let history = useHistory();

    const basicContentValue = useQuery(gqlBasicContent, {
        variables: {id: "631cb30fcc23758543a59ab8"},
        notifyOnNetworkStatusChange: true,
    });
    
    console.log("basicContentValue :", basicContentValue)

    return ( <div>
                {
                    basicContentValue.loading
                    ? <CircularProgress />
                    : <Typography dangerouslySetInnerHTML={{ __html: basicContentValue.data.basicContent.data.description }} />
                }
            </div>);
};

export default PrivacyAndTerms;
  