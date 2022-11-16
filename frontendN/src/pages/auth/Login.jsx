import React , {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { useDeviceData } from "react-device-detect";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import _ from "lodash";
import LoginGithub from 'react-login-github';
import axios from "axios";
import GitHubIcon from '@mui/icons-material/GitHub';
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from '@mui/icons-material/Lock';

import { login } from "../../redux/actions/auth"

import { gqlLogin, gqlLoginWithSocial, gqlConversations, gqlPosts, gqlHomes } from "../../gqlQuery"

const Login = (props) => {
    let history = useHistory();
    let deviceData = useDeviceData();

    // localStorage.clear()

    let { user, login } = props

    if(!_.isEmpty(user)){
        history.push("/me");
    }

    let [input, setInput]   = useState({ username: "",  password: ""});
    const [onLogin, resultLogin] = useMutation(gqlLogin, {
        refetchQueries: [  {query: gqlConversations}, {query: gqlPosts}, {query : gqlHomes} ],
        onCompleted(data) {
            console.log("onCompleted :", data)
    
            // localStorage.setItem('token', data.login.token)
            login(data.login.data)

            history.push("/");
        },
        onError(err){
          console.log("onError :", err)
        }
    });
      // 
    
    if(resultLogin.called && !resultLogin.loading){
        console.log("resultLogin :", resultLogin)
    }

    const [onLoginWithSocial, resultLoginWithSocial] = useMutation(gqlLoginWithSocial, 
        {
          update: (cache, {data: {loginWithSocial}}) => {

            console.log("loginWithSocial :", loginWithSocial)
            // const data1 = cache.readQuery({ query: gqlBanks });

            let {status, data} = loginWithSocial

            if(status){

            }
    
            // let newBanks = {...data1.banks}
            // let newData  = _.map(newBanks.data, bank=>bank._id == updateBank._id ? updateBank : bank)
    
            // newBanks = {...newBanks, data: newData}
            // cache.writeQuery({
            //   query: gqlBanks,
            //   data: { banks: newBanks },
            // });
          },
          onCompleted({ data }) {
            history.push("/");
          }
        }
    );
    
    console.log("resultLoginWithSocial : ", resultLoginWithSocial)

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
          ...prev,
          [name]: value
        }));
    };

    const handleSubmit = (event) =>{
        event.preventDefault();    
        onLogin({ variables: { input: { username: input.username,  password: input.password, deviceAgent: JSON.stringify(deviceData) }} })
    }

    const onGithubSuccess = async(response) =>{
        console.log("onGithubSuccess :", response)

        let {code} = response
        if(!_.isEmpty(code)){
            onLoginWithSocial({ variables: { input: { authType: "GITHUB",  data: response }} })
        }
    }

    const onGithubFailure = (response) =>{
        console.log("onGithubFailure :", response)
    }

    return (
            <div className="page-userlog pl-2 pr-2">
                <div className="Mui-usercontainerss">
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex form-input">
                                <label>Username </label>
                                <div className="position-relative wrapper-form">
                                    <input type="text" name="username" className="input-bl-form" value={input.username} onChange={onInputChange} required />
                                    <AccountCircle />
                                </div>
                        </div>
                        <div className="d-flex form-input">
                                <label>Password </label>
                                <div className="position-relative wrapper-form">
                                    <input type="password" name="password" className="input-bl-form" value={input.password} onChange={onInputChange} required />
                                    <LockIcon/>
                                </div>
                        </div>
                        <button type="submit">Login</button>    
                    </form>
                    <LoginGithub 
                        clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
                        onSuccess={onGithubSuccess}
                        onFailure={onGithubFailure}
                        className={"login-github"}
                        children={<React.Fragment><i className="left"><GitHubIcon /></i><span>Github</span></React.Fragment>}/>
                </div>
            </div> );
};

const mapStateToProps = (state, ownProps) => {
    return { user: state.auth.user }
};

const mapDispatchToProps = { login }
  
export default connect( mapStateToProps, mapDispatchToProps )(Login);  