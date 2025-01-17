import React, {useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useDeviceData } from "react-device-detect";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from '@mui/icons-material/Lock';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { GoogleLogin, useGoogleLogin  } from "react-google-login";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import _ from "lodash";
import { gapi } from "gapi-script"
import LoginGithub from 'react-login-github';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTranslation } from "react-i18next";

import { gqlLogin, gqlPosts, gqlHomes, gqlLoginWithSocial } from "./gqlQuery"

const DialogLogin = (props) => {
  const { t } = useTranslation();
  
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const facebookAppId =  process.env.REACT_APP_FACEBOOK_APPID
  let history = useHistory();
  let deviceData = useDeviceData();

  const { login, onComplete, onClose, selectedValue, open } = props;

  const [input, setInput]   = useState({ username: "",  password: ""});
  const [onLogin, resultLogin] = useMutation(gqlLogin, {
    refetchQueries: [ {query: gqlPosts}, {query : gqlHomes} ],
    onCompleted(data) {

      // console.log("onCompleted :", data)

      // localStorage.setItem('token', data.login.token)
      // login(data.login.data)
      // onComplete()
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

  const [onLoginWithSocial, resultLoginWithSocial] = useMutation(gqlLoginWithSocial, 
    {
      update: (cache, {data: {loginWithSocial}}) => {

        console.log("loginWithSocial :", loginWithSocial)
        // const data1 = cache.readQuery({ query: gqlBanks });

        /**
        {
          "status": true,
          "data": {
              "roles": [
                  "62a2ccfbcf7946010d3c74a4",
                  "62a2ccfbcf7946010d3c74a6"
              ],
              "isOnline": true,
              "socialType": "google",
              "_id": "6374b61fe725361bfd7c648f",
              "username": "android.somkid@gmail.com",
              "password": "U2FsdGVkX18sfvgb9HQzYNBWc7BA5jXKtEvfCfsSFu6sOvr/yVJu5t1kQcs95y9f",
              "email": "android.somkid@gmail.com",
              "displayName": "Somkid Simajarn",
              "isActive": "active",
              "image": [
                  {
                      "_id": "6374b61fe7253692ad7c6490",
                      "url": "https://lh3.googleusercontent.com/a/ALm5wu344XiQRGR8-rghA_KrCP8v9glYQIa7XPUI9R995g=s96-c",
                      "filename": "112378752153101585347.jpeg",
                      "mimetype": "image/jpeg",
                      "encoding": "7bit"
                  }
              ],
              "lastAccess": "2022-11-16T10:06:23.078Z",
              "socialId": "112378752153101585347",
              "socialObject": "{\"Ca\":\"112378752153101585347\",\"xc\":{\"token_type\":\"Bearer\",\"access_token\":\"ya29.a0AeTM1id1RGQ7B6lAVG4PgbOeUnkoWfpsuImZieZwzosk4myh7l0ITuu4pKGCuTBSFAuGhR35uwPKTuKlVzyIK0K_XzNCNKokH2WcDgiWmIuohx-V2MaiuqwjOhIYd_5rBETFuUVlGnhJ3QfNo-WIo-k9IzYHakIaCgYKAU0SARASFQHWtWOmXQ2AZUGjbgfxIYeXbkZykQ0166\",\"scope\":\"email profile https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email\",\"login_hint\":\"AJDLj6IwgLvhCVpEzCp3uaFdvrRlobPVw2fzQGnDcVDRIWfEVnCZ5tBvMV9RxH-EeHG6FMgjgi6XG_nZk3EgDid15uEuqyQHKQ\",\"expires_in\":3599,\"id_token\":\"eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTEx0N3NVSzhzTXlIR2FWSUdxWFRZZyIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MzQ0WGlRUkdSOC1yZ2hBX0tyQ1A4djlnbFlRSWE3WFBVSTlSOTk1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJTb21raWQiLCJmYW1pbHlfbmFtZSI6IlNpbWFqYXJuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njg1OTMxODIsImV4cCI6MTY2ODU5Njc4MiwianRpIjoiZDVmYjA1N2RlZDc1ZGZkNTAyYWQxZTY5Y2RkMTM3YTVmN2M5MGZhYSJ9.i39ECcoudJ4o03YRk1MBaQjSY5cWdXqtrU5t6kDQlqPyZghMwVQZUS5gxw2pxyBzAc748ydiEx67SW12vT5Fr78MhDiLn_ea1IQPKfwrwr8Hf_Z0DazLxvAPVFA1VsNAGXplHcPbD0LElwnTytVC7yQanG7LFBJsIpICSLTaV7xpyBoT3NOJ9NJChX5n1Nq3nJSVmNQX7mqjXu4Zj9y0wuPU2K9CJaVi9C7YyZq4hVru4NruXZcxuT0FrLUDdLd7qW31pE1XrZfSHcQskeYhkcTQ3ohW712ViI4DiA18gMjJX4rgqpfdAqT569UdOu0m6Zb6X7Bbx8-d4F7NkS-Uuw\",\"session_state\":{\"extraQueryParams\":{\"authuser\":\"0\"}},\"first_issued_at\":1668593182958,\"expires_at\":1668596781958,\"idpId\":\"google\"},\"wt\":{\"NT\":\"112378752153101585347\",\"Ad\":\"Somkid Simajarn\",\"rV\":\"Somkid\",\"uT\":\"Simajarn\",\"hK\":\"https://lh3.googleusercontent.com/a/ALm5wu344XiQRGR8-rghA_KrCP8v9glYQIa7XPUI9R995g=s96-c\",\"cu\":\"android.somkid@gmail.com\"},\"googleId\":\"112378752153101585347\",\"tokenObj\":{\"token_type\":\"Bearer\",\"access_token\":\"ya29.a0AeTM1iepzhxFZkdmkevfWNrJ1RcymJoNx60ytUDFfPMgviTKx5Dc68sfzMVpCM6CwDw7CHC4DpLFdEj-1fwkgAMr1O1rDCfhvW1ehDr50-MGxQCi8_FUTaryu7rNaY0aBY-v9E3hPjY12bGLhzsQTNvTLRzqyskaCgYKAdcSARASFQHWtWOmXwa3qHwvLkTnwXludF4Txw0166\",\"scope\":\"email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid\",\"login_hint\":\"AJDLj6IwgLvhCVpEzCp3uaFdvrRlobPVw2fzQGnDcVDRIWfEVnCZ5tBvMV9RxH-EeHG6FMgjgi6XG_nZk3EgDid15uEuqyQHKQ\",\"expires_in\":742,\"id_token\":\"eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUFlXQndRcjZLUjYwMW9Hc3RpQVVJUSIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MzQ0WGlRUkdSOC1yZ2hBX0tyQ1A4djlnbFlRSWE3WFBVSTlSOTk1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJTb21raWQiLCJmYW1pbHlfbmFtZSI6IlNpbWFqYXJuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njg1OTAzMjYsImV4cCI6MTY2ODU5MzkyNiwianRpIjoiYzUwZWU2MDY4N2ExZDM2N2I0MThhZjBjNjNjMTAzMjcxMmY0ZDEwNCJ9.Op24r__jHsUpb-mQ-RYM3yQlt5uEmNYCfLm1v-Cj6CZX2UssjsvBMoH2qu7GOQf1ZRjReNcHQkm3HFmGk2tZCqKhQ1LVvzN3Zfj_r4EvFapabDY6Ni_L3VRM7Xgd_1DJ2E2mzTJTN-T3qse9cUpWttixakPRvJpKhILNLCkfpJz5z-Xu-zFzhlgQV-5US48RU9jn-Ovm-Bgcv74h6wGrpNsK5WOQbauWVWRnY4FllMbpoGn85DOVZPnTbh-7K8lfbYZj8NSxyG1_y6NGQxVFmL7XHxsjIY08cuxJB-in5vL8Y3i2eew5HzOBSp9DpFgNoH4FXfw-4sALnC5zRSAP9g\",\"session_state\":{\"extraQueryParams\":{\"authuser\":\"0\"}},\"first_issued_at\":1668590326411,\"expires_at\":1668593925411,\"idpId\":\"google\"},\"tokenId\":\"eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUFlXQndRcjZLUjYwMW9Hc3RpQVVJUSIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MzQ0WGlRUkdSOC1yZ2hBX0tyQ1A4djlnbFlRSWE3WFBVSTlSOTk1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJTb21raWQiLCJmYW1pbHlfbmFtZSI6IlNpbWFqYXJuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njg1OTAzMjYsImV4cCI6MTY2ODU5MzkyNiwianRpIjoiYzUwZWU2MDY4N2ExZDM2N2I0MThhZjBjNjNjMTAzMjcxMmY0ZDEwNCJ9.Op24r__jHsUpb-mQ-RYM3yQlt5uEmNYCfLm1v-Cj6CZX2UssjsvBMoH2qu7GOQf1ZRjReNcHQkm3HFmGk2tZCqKhQ1LVvzN3Zfj_r4EvFapabDY6Ni_L3VRM7Xgd_1DJ2E2mzTJTN-T3qse9cUpWttixakPRvJpKhILNLCkfpJz5z-Xu-zFzhlgQV-5US48RU9jn-Ovm-Bgcv74h6wGrpNsK5WOQbauWVWRnY4FllMbpoGn85DOVZPnTbh-7K8lfbYZj8NSxyG1_y6NGQxVFmL7XHxsjIY08cuxJB-in5vL8Y3i2eew5HzOBSp9DpFgNoH4FXfw-4sALnC5zRSAP9g\",\"accessToken\":\"ya29.a0AeTM1iepzhxFZkdmkevfWNrJ1RcymJoNx60ytUDFfPMgviTKx5Dc68sfzMVpCM6CwDw7CHC4DpLFdEj-1fwkgAMr1O1rDCfhvW1ehDr50-MGxQCi8_FUTaryu7rNaY0aBY-v9E3hPjY12bGLhzsQTNvTLRzqyskaCgYKAdcSARASFQHWtWOmXwa3qHwvLkTnwXludF4Txw0166\",\"profileObj\":{\"googleId\":\"112378752153101585347\",\"imageUrl\":\"https://lh3.googleusercontent.com/a/ALm5wu344XiQRGR8-rghA_KrCP8v9glYQIa7XPUI9R995g=s96-c\",\"email\":\"android.somkid@gmail.com\",\"name\":\"Somkid Simajarn\",\"givenName\":\"Somkid\",\"familyName\":\"Simajarn\"},\"token_type\":\"Bearer\",\"access_token\":\"ya29.a0AeTM1id1RGQ7B6lAVG4PgbOeUnkoWfpsuImZieZwzosk4myh7l0ITuu4pKGCuTBSFAuGhR35uwPKTuKlVzyIK0K_XzNCNKokH2WcDgiWmIuohx-V2MaiuqwjOhIYd_5rBETFuUVlGnhJ3QfNo-WIo-k9IzYHakIaCgYKAU0SARASFQHWtWOmXQ2AZUGjbgfxIYeXbkZykQ0166\",\"scope\":\"email profile https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email\",\"login_hint\":\"AJDLj6IwgLvhCVpEzCp3uaFdvrRlobPVw2fzQGnDcVDRIWfEVnCZ5tBvMV9RxH-EeHG6FMgjgi6XG_nZk3EgDid15uEuqyQHKQ\",\"expires_in\":3599,\"id_token\":\"eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiTEx0N3NVSzhzTXlIR2FWSUdxWFRZZyIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MzQ0WGlRUkdSOC1yZ2hBX0tyQ1A4djlnbFlRSWE3WFBVSTlSOTk1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJTb21raWQiLCJmYW1pbHlfbmFtZSI6IlNpbWFqYXJuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njg1OTMxODIsImV4cCI6MTY2ODU5Njc4MiwianRpIjoiZDVmYjA1N2RlZDc1ZGZkNTAyYWQxZTY5Y2RkMTM3YTVmN2M5MGZhYSJ9.i39ECcoudJ4o03YRk1MBaQjSY5cWdXqtrU5t6kDQlqPyZghMwVQZUS5gxw2pxyBzAc748ydiEx67SW12vT5Fr78MhDiLn_ea1IQPKfwrwr8Hf_Z0DazLxvAPVFA1VsNAGXplHcPbD0LElwnTytVC7yQanG7LFBJsIpICSLTaV7xpyBoT3NOJ9NJChX5n1Nq3nJSVmNQX7mqjXu4Zj9y0wuPU2K9CJaVi9C7YyZq4hVru4NruXZcxuT0FrLUDdLd7qW31pE1XrZfSHcQskeYhkcTQ3ohW712ViI4DiA18gMjJX4rgqpfdAqT569UdOu0m6Zb6X7Bbx8-d4F7NkS-Uuw\",\"session_state\":{\"extraQueryParams\":{\"authuser\":\"0\"}},\"first_issued_at\":1668593182958,\"expires_at\":1668596781958,\"idpId\":\"google\"}",
              "createdAt": "2022-11-16T10:06:23.094Z",
              "updatedAt": "2022-11-16T10:06:23.094Z",
              "__v": 0
          },
          "executionTime": "Time to execute = 0.014 seconds"
        }  
        */

        let {status, data, sessionId} = loginWithSocial

        if(status){
          localStorage.setItem('token', sessionId)

          onComplete(data)
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
      },
      onError({error}){
        console.log("onError :")
      }
    }
  );

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
    
    if(!_.has(response, "status")){
      onLoginWithSocial({ variables: { input: { authType: "FACEBOOK",  data: response, deviceAgent: JSON.stringify(deviceData)  }} })
    }else{
      console.log("")
    }

    // status: "unknown"
    /*

    {
      "name": "Somkid Sim",
      "email": "android.somkid@gmail.com",
      "picture": {
          "data": {
              "height": 50,
              "is_silhouette": false,
              "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=5031748820263498&height=50&width=50&ext=1671182329&hash=AeQLQloZ6CBWqqOkPFg",
              "width": 50
          }
      },
      "id": "5031748820263498",
      "accessToken": "EAARcCUiGLAQBAB4mB4GalPuSBMId15c4hEr3CSEYNxQERzKSnExjuQFuxsOif3MbmZCwm5nwwQNh1tFZBiJjCZB5CiKFHShYM3DHGOZB2QkMYFBWbcs6sRClw5BI7YsOLdtJNYHVpBqjvjdbQwWKtiNzZB1HttaVEDvYqUkWkPiKMR2n7IwC2dZCKJ582fkyN5ZCFdN8nBvcsZBTSRYivvFf",
      "userID": "5031748820263498",
      "expiresIn": 6072,
      "signedRequest": "AKX_cpK80gAe_KXsAIFB3SM8348W2xe9j_PbqPfSNcQ.eyJ1c2VyX2lkIjoiNTAzMTc0ODgyMDI2MzQ5OCIsImNvZGUiOiJBUUM5MTNhVXJHRGRfMVBRWmtpV0VOY0lRckVMRkdVUVo5eldvQkdNUUVxbUhRekd0N1lWSi1aZWRrRHpSY2w2em1udjVQX1ZnZno0UHBYTGJSS0FWZU1GWkpTTzhsVDM3SmNpYkZwWFA3Q3VMelNsVmJ3YXpCT1pjNXI3bFJmMlNGV1JUWUJJbHhDZGN0Q0N6WExzU2dLeTlkRFQ0UGtBV2ZSa1Bpc2dUS21yanRpMi1ELWZ0cjF5dEJ1Y1N3cDZQNVVHa2REaXRYTVgwZU9DYWlmeFVzeS1HbTJ4NWxoR25wczgzWmFrSDZ6TGltcENxdXplVjBPMVFlcEppMmstb2ozc09ueW9KSnE0Vzc4emJ1X1ZvLWhvd3FrZEtsTkxucWVLX09TMDhKUmwxQjhTXzdxcFZHZ243a283TWM1MHg2OGlmQzhPaFgxWURpNjFadDBCVWNaQiIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNjY4NTkwMzI4fQ",
      "graphDomain": "facebook",
      "data_access_expiration_time": 1676366328
    }
    */ 
  }

  // https://github.com/Sivanesh-S/react-google-authentication/blob/master/src/utils/refreshToken.js
  const onGoogleSuccess = async(response) => {
    console.log("onGoogleSuccess :", response);

    const newAuthRes = await response.reloadAuthResponse();
    console.log("responseGoogle newAuthRes :", newAuthRes)
    // localStorage.setItem('authToken', newAuthRes.id_token);

    onLoginWithSocial({ variables: { input: { authType: "GOOGLE",  data: {...response, ...newAuthRes}, deviceAgent: JSON.stringify(deviceData)  }} })

    // error: "popup_closed_by_user"
    /*
    --------  response  --------
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
   
    /*
    ----------  newAuthRes ----------
    {
      "token_type": "Bearer",
      "access_token": "ya29.a0AeTM1icjWxWZTlNE7aW4I-NxP3VY4f6QG6b4e1aXeGmcqLzKV0yeDvWXy5XannL_LOu0gqwF-HLeeOxoF5BlU3gRyLk0-w_ttsZIigVmwNFn-FGn_0sXDK4LoUk-Y5YefGRsHilAmAAHz7jMgMb6B80xNw5xD2MaCgYKAa0SARASFQHWtWOmmIZpKcbUdv0btmC2gGUpRw0166",
      "scope": "email profile https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email",
      "login_hint": "AJDLj6IwgLvhCVpEzCp3uaFdvrRlobPVw2fzQGnDcVDRIWfEVnCZ5tBvMV9RxH-EeHG6FMgjgi6XG_nZk3EgDid15uEuqyQHKQ",
      "expires_in": 3599,
      "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxM2ZkNjhjOTY2ZTI5MzgwOTgxZWRjMDE2NGEyZjZjMDZjNTcwMmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NDIwMzg2NTg0My1qcWFqOWFtNHRldnRvY2c3NXRkaXJtdGtoOTVrMjdjYi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTQyMDM4NjU4NDMtanFhajlhbTR0ZXZ0b2NnNzV0ZGlybXRraDk1azI3Y2IuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIzNzg3NTIxNTMxMDE1ODUzNDciLCJlbWFpbCI6ImFuZHJvaWQuc29ta2lkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUGFVamZwSVM3d0hFOWV5SlBFcDNWUSIsIm5hbWUiOiJTb21raWQgU2ltYWphcm4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1MzQ0WGlRUkdSOC1yZ2hBX0tyQ1A4djlnbFlRSWE3WFBVSTlSOTk1Zz1zOTYtYyIsImdpdmVuX25hbWUiOiJTb21raWQiLCJmYW1pbHlfbmFtZSI6IlNpbWFqYXJuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Njg0NzkwMDQsImV4cCI6MTY2ODQ4MjYwNCwianRpIjoiYzIzYTg2MTIxMTBkNGI1YWIwNmU5MWFhZmEwMGZiYjMxMWY0ZGM2YyJ9.tAOZq5O1pBUHOz5IwtfK5pmk6PP1I5MYmDm0erAjq5PHRC7JUNddlzTiqpN5zprWVBfjdlbMytwbMWwtrSOd_mCdXaK7ffiMYHi91A4tA0_7JvRErAn8-6ZvzjCMl807BcuyuqFvZEHuYkJTGaSV4kmI4d-NDirtWHA2RJQEscLyktkG3t3GxSwF9axoiMzBNPSi_bZ6xKfTLEcgG7t85Wq1DwLGPHmOuIfgdS-q-mMnklPX5x8sCSTNvitsIjK5v_56c0bWrfWzKbiCfkv2UyVWPKRg01CdnRsgnZeUeLaV3mB5-6HKsTsUE3rmA01iJZVw9F-NzuVFwqx9G5z0lQ",
      "session_state": {
          "extraQueryParams": {
              "authuser": "0"
          }
      },
      "first_issued_at": 1668479006076,
      "expires_at": 1668482605076,
      "idpId": "google"
    }
    */
  };

  const onGoogleFailure = (response) =>{
    console.log("onGoogleFailure :", response);
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
              <div className="d-flex form-input">
                <label>{t("username")}</label>
                <div className="position-relative wrapper-form">
                  <input type="text" className="input-bl-form" name="username" value={input.username} onChange={onInputChange} required/>
                  <AccountCircle />
                </div>
               
              </div>
              <div className="d-flex form-input">
                <label>{t("password")}</label>
                <div className="position-relative wrapper-form">
                  <input type="password" className="input-bl-form" name="password" value={input.password} onChange={onInputChange} required />
                  <LockIcon />
                </div>
              </div>
              <button type="submit">{t("login")}</button>
            </form>
  }

  const onGithubSuccess = async(response) =>{
    console.log("onGithubSuccess :", response)

    let {code} = response
    if(!_.isEmpty(code)){
      onLoginWithSocial({ variables: { input: { authType: "GITHUB",  data: response, deviceAgent: JSON.stringify(deviceData)}} })
    }
  }

  const onGithubFailure = (response) =>{
      console.log("onGithubFailure :", response)
  }

  return (
    <Dialog 
    onClose={(e)=>{
      onClose(false)
    }} 
    open={open}>
      
      <DialogTitle className="text-center">{t("welcome_to_banlist")}</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="text-center">Get a free account, no credit card required</DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { formUserLogin() }
          <div className="d-flex flex-wrap">
            <GoogleLogin
              clientId={googleClientId}
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled}><GoogleIcon /> <span> Google</span> </button>
              )}
              buttonText="Login"
              onSuccess={onGoogleSuccess}
              onFailure={onGoogleFailure}
              cookiePolicy={'single_host_origin'}
              // isSignedIn={true}
            />
            <FacebookLogin
              className={"facebookLogin"}
              appId={facebookAppId}
              autoLoad={false}
              // fields="name,email,picture"
              // onClick={(e)=>{
              //   console.log("FacebookLogin :", e)
              // }}
              fields="name,email,picture"
              callback={callbackFacebook} 
              render={renderProps => (
                <button onClick={renderProps.onClick}><FacebookIcon/> <span>Facebook </span></button>
              )}/>
            <LoginGithub 
              clientId={process.env.REACT_APP_GITHUB_CLIENT_ID}
              onSuccess={onGithubSuccess}
              onFailure={onGithubFailure}
              className={"login-github"}
              children={<React.Fragment><i className="left"><GitHubIcon /></i><span>Github</span></React.Fragment>}/>
          </div>
        </DialogContentText>
        </DialogContent>
        <DialogContent className="text-center">
            <Typography variant="body2" color="text.secondary">By continuing, you agree to Banlist Terms of Service, Privacy Policy</Typography>
        </DialogContent>
    </Dialog>    
  );
};

export default DialogLogin;
