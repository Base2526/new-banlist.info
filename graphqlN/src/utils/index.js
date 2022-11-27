import jwt from 'jsonwebtoken';
import _ from "lodash";
import deepdash from "deepdash";
deepdash(_);

import {Session} from '../model'

export const emailValidate = () =>{
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
}

export const fileRenamer = (filename) => {
    const queHoraEs = Date.now();
    const regex = /[\s_-]/gi;
    const fileTemp = filename.replace(regex, ".");
    let arrTemp = [fileTemp.split(".")];
    return `${arrTemp[0].slice(0, arrTemp[0].length - 1).join("_")}${queHoraEs}.${arrTemp[0].pop()}`;
};

export const getSessionId = async(uid, input) =>{
    let newInput = {...input, token: jwt.sign(uid, process.env.JWT_SECRET)}
  
    let session = await Session.findOne({deviceAgent: newInput.deviceAgent})
    if(_.isEmpty(session)){
      session = await Session.create(newInput);
    }
  
    return session._id.toString()
}