import React , {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';

import Typography from "@material-ui/core/Typography";
import { gqlBasicContent } from "../../gqlQuery"
import { getHeaders } from "../../util"

const Pdpa = (props) => {
    let history = useHistory();

    const basicContentValue = useQuery(gqlBasicContent, {
        context: { headers: getHeaders() },
        variables: {id: "63b3b38d4ba8b53f7c88c84b"},
        notifyOnNetworkStatusChange: true,
    });

    return ( <div>
                {
                    basicContentValue.loading
                    ? <CircularProgress />
                    : <Typography dangerouslySetInnerHTML={{ __html: basicContentValue.data.basicContent.data.description }} />
                }
            </div>);
};

export default Pdpa;
  