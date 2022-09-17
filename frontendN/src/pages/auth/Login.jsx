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
import { login } from "../../redux/actions/auth"

import { gqlLogin, gqlConversations, gqlPosts, gqlHomes } from "../../gqlQuery"

const Login = (props) => {
    let history = useHistory();
    let deviceData = useDeviceData();

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

    return (<form onSubmit={handleSubmit}>
                <div>
                    <label>Username </label>
                        <input type="text" name="username" value={input.username} onChange={onInputChange} required />
                </div>
                <div>
                    <label>Password </label>
                    <input type="password" name="password" value={input.password} onChange={onInputChange} required />
                </div>
                <button type="submit">Login</button>
            </form> );
};

const mapStateToProps = (state, ownProps) => {
    return { user: state.auth.user }
};

const mapDispatchToProps = { login }
  
export default connect( mapStateToProps, mapDispatchToProps )(Login);  