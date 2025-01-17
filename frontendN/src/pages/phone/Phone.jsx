import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import _ from "lodash";
import { useTranslation } from "react-i18next";

import TelInputField from "../post/TelInputField";
import Editor from "../../components/editor/Editor";

import { gqlCreatePhone, gqlUpdatePhone, gqlPhones, gqlPhone } from "../../gqlQuery"

import { getHeaders } from "../../util"

let editValues = undefined;
let initValues = { phones: [''] , description: "", ownerId:""}

const Phone = (props) => {
    const history = useHistory();
    const { t } = useTranslation();

    let { user } = props
    let { id, mode } = useParams();
    let [input, setInput]       = useState(initValues);

    const [onCreatePhone, resultCreatePhone] = useMutation(gqlCreatePhone, {
        context: { headers: getHeaders() },
        update: (cache, {data: {createPhone}}) => {
            const data1 = cache.readQuery({ query: gqlPhones, variables: { page: 0, perPage: 30 } });
            if(data1 != null){
                let newPhones = {...data1.phones}
                let newData = [...newPhones.data, createPhone.data]
    
                newPhones = {...newPhones, data: newData}
                cache.writeQuery({
                    query: gqlPhones,
                    data: { phones: newPhones },
                    variables: { userId: _.isEmpty(user) ? "" : user._id, page: 0, perPage: 30 }
                });
            }
        },
        onCompleted({ data }) {
            history.push("/phones")
        },
        onError({error}){
          console.log("onError :")
        }
    });
    console.log("createPhone :", resultCreatePhone)

    const [onUpdatePhone, resultUpdatePhone] = useMutation(gqlUpdatePhone, {
        context: { headers: getHeaders() },
        update: (cache, {data: {updatePhone}}) => {
            const data1 = cache.readQuery({ query: gqlPhone, variables: {id} });
    
            let newPhone = {...data1.phone}
            let newData = {...newPhone.data, ...updatePhone.data}
            newPhone = {...newPhone, data: newData}

            cache.writeQuery({
              query: gqlPhone,
              data: {
                phone: newPhone
              },
              variables: {id}
            });

            // console.log("onUpdatePhone : ", id, newPhone)

            const data2 = cache.readQuery({ query: gqlPhones, 
                                            variables: { page: 0, perPage: 30 },
                                            notifyOnNetworkStatusChange: true
                                          });

            if(data2 != null){
                let newPhones = {...data2.phones}
                let newData = _.map(newPhones.data, (phone)=>phone._id === updatePhone.data._id ? updatePhone.data : phone)

                newPhones = {...newPhones, data: newData}
                cache.writeQuery({
                    query: gqlPhones,
                    data: { phones: newPhones },
                    variables: { userId: _.isEmpty(user) ? "" : user._id, page: 0, perPage: 30 }
                });
            }
        },
        onCompleted({ data }) {
            history.push("/phones")
        },
        onError({error}){
          console.log("onError :")
        }
        
    });
    console.log("updatePhone :", resultUpdatePhone)

    switch(mode){
        case "new":{
            editValues = undefined
            break;
        }
    
        case "edit":{
            editValues = useQuery(gqlPhone, { variables: {id}, notifyOnNetworkStatusChange: true });
            if(_.isEqual(input, initValues)) {
                if(!_.isEmpty(editValues)){
                    let {loading}  = editValues
                    
                    if(!loading){
                        let {status, data} = editValues.data.phone

                        if(status){
                            setInput({
                                phones: data.phones,
                                description: data.description
                            })
                        }
                    }
                }
            }
            break;
        }
    }

    useEffect(()=>{
        console.log("input :", input)
    }, [input])

    const submitForm = async(event) => {
        event.preventDefault();

        input = {...input, ownerId: user._id}

        switch(mode){
            case "new":{
                onCreatePhone({ variables: { input: {
                    phones: _.filter(input.phones, (tel)=>!_.isEmpty(tel)),
                    description: input.description
                  }
                }});
                break;
            }
      
            case "edit":{
                let newInput =  {
                                    phones: _.filter(input.phones, (tel)=>!_.isEmpty(tel)),
                                    description: input.description
                                }
        
                onUpdatePhone({ variables: { 
                    id: editValues.data.phone.data._id,
                    input: newInput
                }});
              break;
            }
        }
    }

    return  <div>
                <div className="page-phone pl-2 pr-2 mb-4">
                    <div className="MuiBox-root-phoneinss">
                        {
                            editValues != null && editValues.loading
                            ? <div><CircularProgress /></div> 
                            :<LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Box component="form"
                                    sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
                                    onSubmit={submitForm}>
                                    <TelInputField
                                        label={t("search_by_tel")} 
                                        values={ input.phones }
                                        onChange={(values) => {
                                            setInput({...input, phones: values})
                                        }}/>
                                    <Editor 
                                        label={t("detail")} 
                                        initData={ input.description }
                                        onEditorChange={(newDescription)=>{
                                            setInput({...input, description: newDescription})
                                        }}/>
                                    <Button type="submit" variant="contained" color="primary">
                                    {mode === 'new' ? t("create") : t("update")}  
                                    </Button>
                                </Box>
                            </LocalizationProvider>
                        }
                    </div>
                </div>
            </div>
}

const mapStateToProps = (state, ownProps) => {
    return {
      user: state.auth.user,
    }
};

export default connect( mapStateToProps, null )(Phone);