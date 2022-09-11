import React, {useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useDeviceData } from "react-device-detect";



import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { GoogleLogin, useGoogleLogin  } from "react-google-login";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { gapi } from "gapi-script"

import { gqlLogin, gqlConversations, gqlPosts, gqlHomes } from "./gqlQuery"

const DialogLogin = (props) => {

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const facebookAppId =  process.env.FACEBOOK_APPID

  let history = useHistory();

  let deviceData = useDeviceData();

  const { login, onComplete, onClose, selectedValue, open } = props;

  const [input, setInput]   = useState({ username: "",  password: ""});
  const [onLogin, resultLogin] = useMutation(gqlLogin, {
    refetchQueries: [  {query: gqlConversations}, {query: gqlPosts}, {query : gqlHomes} ],
    onCompleted(data) {

      console.log("onCompleted :", data)

      localStorage.setItem('token', data.login.token)
      login(data.login.data)
      onComplete()
    },
    onError(err){
      console.log("onError :", err)
    }
  });
  // 

  if(resultLogin.called && !resultLogin.loading){
    console.log("resultLogin :", resultLogin)

    // if(resultLogin.data.login.status){

    //   // localStorage.setItem('token', resultLogin.data.login.token)
      
    //   // onComplete(resultLogin.data.login.data)
    // }else{
    //   // messages
    // }
  }

  useEffect(()=>{
    const initClient = () =>{
      gapi.client.init({
        clientId: googleClientId,
        scope: ""
      })
    }
    gapi.load("client:auth2", initClient)
  }, [])

  useEffect(()=>{
    console.log("input :", input)
  }, [input])


  const callbackFacebook = (response) => {
    console.log( "callbackFacebook :", response);

    // status: "unknown"
    /*
    accessToken : "EAARcCUiGLAQBADwyeiaZBkcKdwv3vkxvoMoSclv2YRIF2w0LL4i7K6p6s6pZArSgPK8FHtg7ksjfZARFWLTVZA8XPHd2wNvo7xY19kApPOkNbCX1afW1f4LPRQ6Pv71MZB91TS2mUfsCEoYYZA8wvW8Vx64r8GNVjxXUBZB5Wi9PBmgALQXfWEAkdfOofV863PJZCmOkbxJMgYPXRA8jWYvq"
    data_access_expiration_time :  1670679481
    expiresIn : 4919
    graphDomain : "facebook"
    id : "5031748820263498"
    name : "AThe Station"
    signedRequest :  "jD1WOiVhDQn_0K_s0l7iSQd-4mZ403JLybYbzDeyJZo.eyJ1c2VyX2lkIjoiNTAzMTc0ODgyMDI2MzQ5OCIsImNvZGUiOiJBUUROV1dCeVlYdlFOaWo1aFVkeGhzdFEzbUlLdU1KcFRUM21pUDZQVFh3cENHd2F0VTVWc1d5aWQ3bi1yYWtOZUFYNDhmYV9HZkptUDg3Uk9OYnpCY1p4XzREQ2NOMmt4YldSVzdzMWY5ZS10TnR1TW92UERmYy1xNUN5b09scVZXbExUQ25Ielg2X0ZPc0pyTy03YnlqeC1WOE5aN0dkcVFQb0cyOUFkOXVFZl9YQmwyU3Q2bnV5Vm96bzBRTVUwTVhPVS1kazM3eEZRRlNzS0Y3V3JzY1Q4amJjOE8yeUYtYkRTVExMaDEycmRmdTk2b1ZFQW1GTy1KTkxJa2xzQmdCaEc2Q1EtX0F5SjJnM0RJYWRfVzhNMUJqOWd0V05zWDE2UkdOa2hzUzhvdmZkX1lOQlZBU0ZSYzZ4YkQyVG8wSkE2UXpuMEZIVVE4S1lkcG5RVVJLNXNyVnZLQTJSMVdYNnpXMThFUEFfVzVJZFhtUlBWeFhjMmxyR0QwWjZZSGMiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTY2MjkwMzQ4MX0"
    userID : "5031748820263498"
    */ 
  }

  // https://github.com/Sivanesh-S/react-google-authentication/blob/master/src/utils/refreshToken.js
  const onSuccess = (response) => {
    console.log("onSuccess :", response);

    // const newAuthRes = await response.reloadAuthResponse();
    // console.log("responseGoogle newAuthRes :", newAuthRes)
    // localStorage.setItem('authToken', newAuthRes.id_token);

    // error: "popup_closed_by_user"
    /*
    accessToken
    googleId
    profileObj {
      email : "android.somkid@gmail.com"
      familyName : "Simajarn"
      givenName : "Somkid"
      googleId : "112378752153101585347"
      imageUrl : "https://lh3.googleusercontent.com/a-/AFdZucrsz6tfMhKB87pCWcdwoMikQwlPG8_aa4h6zYz1ng=s96-c"
      name : "Somkid Simajarn"
    }
    tokenId
    tokenObj {
      access_token : "ya29.a0AVA9y1uPAzoEGM3joZMmfeWhu_i10ANwgeFmvtcLi8AS1o-TytHHCyrqi4-BSCA6g6hbGX4SVIdLzSuGSsMyFT3tL4_RO99je5YfVqpoji0YIDrnuzVvdKK6_uPaMUmW467bYBR75iCBwaGGUQ2ba8P5IC4MaCgYKATASARISFQE65dr8q10VA-k-brPrO1Y-jVwB0Q0163"
      expires_at : 1662901232664
      expires_in : 3599
      first_issued_at : 1662897633664
      id_token : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNhYWJmNjkwODE5MTYxNmE5MDhhMTM4OTIyMGE5NzViM2MwZmJjYTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibjhzSmpBbmVTdWptYlJOdWdvSzItQSIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FGZFp1Y3JzejZ0Zk1oS0I4N3BDV2Nkd29NaWtRd2xQRzhfYWE0aDZ6WXoxbmc9czk2LWMiLCJnaXZlbl9uYW1lIjoiU29ta2lkIiwiZmFtaWx5X25hbWUiOiJTaW1hamFybiIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjYyODk3NjMzLCJleHAiOjE2NjI5MDEyMzMsImp0aSI6ImQ1NDk0YjY1MDliNmYxOTdjYjZhNGQwYTM3MjZiMWRiM2FiZTIxNTUifQ.CAawd4eccCFomK0NBCeMLUEoUM3I8zUJF6zzQoLC-tgZN6EanSOPRECoVU1zFnX002Su0Nwn1ET96c_xq0SS8Wrir0yFXkBDoi7lIEBNvpbcWxa3Jx79V_K1YgVLvmmRyHD_kx15E6zCpbN6g0ItnwpsheSYFK83y062XeAP1RA3_mas0Sa0ubnjRWF3yvpe6CXYhm5s2dIxJMfLbAZ0HECeRkjKclHHwORKO6ZgmYZU92Pk5_760zMedv-sepNCdPAUAaWx6HE8kb6UW-1jYaSo-zH3KuHIYh9j85xJ8lJNII2EI3tC2VcqHLRShiCDGT9kx--utwScg58dsV9QHQ"
      idpId : "google"
      login_hint : "AJDLj6IwgLvhCVpEzCp3uaFdvrRlobPVw2fzQGnDcVDRIWfEVnCZ5tBvMV9RxH-EeHG6FMgjgi6XG_nZk3EgDid15uEuqyQHKQ"
      scope : "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
      token_type : "Bearer"
    }
    */ 
  };

  const onFailure = (response) =>{
    console.log("onFailure :", response);
  };

  const handleSubmit = (event) =>{
    event.preventDefault();

    onLogin({ variables: { input: { username: input.username,  password: input.password, deviceAgent: JSON.stringify(deviceData) }} })
  }

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formUserLogin = () =>{
    return  <form onSubmit={handleSubmit}>
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
  }

  return (
    <Dialog 
    onClose={(e)=>{
      onClose(false)
    }} 
    open={open}>
      <DialogTitle>Sign in to Banlist</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Get a free account, no credit card required
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { formUserLogin() }
          <GoogleLogin
            clientId={googleClientId}
            render={renderProps => (
              <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
            )}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
          />

          <FacebookLogin
            appId={facebookAppId}
            autoLoad={false}
            // fields="name,email,picture"
            // onClick={(e)=>{
            //   console.log("FacebookLogin :", e)
            // }}
            callback={callbackFacebook} 
            render={renderProps => (
              <button onClick={renderProps.onClick}>This is my custom FB button</button>
            )}/>
        </DialogContentText>
        </DialogContent>
        <DialogContent>
            <Typography variant="body2" color="text.secondary">By continuing, you agree to Banlist Terms of Service, Privacy Policy</Typography>
        </DialogContent>
    </Dialog>    
  );
};

export default DialogLogin;