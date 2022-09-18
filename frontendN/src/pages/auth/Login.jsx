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

import { login } from "../../redux/actions/auth"

import { gqlLogin, gqlConversations, gqlPosts, gqlHomes } from "../../gqlQuery"

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
    
            localStorage.setItem('token', data.login.token)
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
        let oauth_access_token = await axios.post("https://github.com/login/oauth/access_token", 
                                    {
                                        client_id: '04e44718d32d5ddbec4c',
                                        client_secret: 'dd1252dea6ec4d05083dc2c2cd53def7be4a9033',
                                        code: response?.code
                                    })

        
        let params = new URLSearchParams(oauth_access_token);
        let access_token = params.get('access_token')

        console.log("onGithubSuccess params :", response, oauth_access_token, access_token)

        if(!_.isEmpty(access_token)){
            let git_user = await axios.get("https://api.github.com/user", { 'Authorization': 'Bearer ' + access_token });
            console.log("git_user :", git_user)
        }
    }

    const onGithubFailure = (response) =>{
        console.log("onGithubFailure :", response)
    }

    return (
            <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username </label>
                        <input type="text" name="username" value={input.username} onChange={onInputChange} required />
                </div>
                <div>
                    <label>Password </label>
                    <input type="password" name="password" value={input.password} onChange={onInputChange} required />
                </div>
                <button type="submit">Login</button>

                
            </form>
            
            <LoginGithub clientId="04e44718d32d5ddbec4c"
                onSuccess={onGithubSuccess}
                onFailure={onGithubFailure}
            />
            </div> );
};

const mapStateToProps = (state, ownProps) => {
    return { user: state.auth.user }
};

const mapDispatchToProps = { login }
  
export default connect( mapStateToProps, mapDispatchToProps )(Login);  