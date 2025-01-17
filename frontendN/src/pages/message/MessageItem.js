import React, { useEffect } from "react";

import _ from "lodash"
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
// import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  AvatarGroup,
  Button,
  Conversation,
  ConversationHeader,
  StarButton,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  ConversationList,
  InputToolbox,
  Loader,
  TypingIndicator,
  StatusList,
  Status,
  Sidebar,
  Search,
  MessageSeparator,
  action,
  ExpansionPanel
} from "@chatscope/chat-ui-kit-react";
import LinearProgress from '@mui/material/LinearProgress';

import { gqlUser } from "../../gqlQuery"

const MessageItem = (props) => {

    let {user, item} = props 
    let {type, message, sentTime, senderId, senderName, position, payload} = item

    let userValues = useQuery(gqlUser, { variables: {id: senderId}, notifyOnNetworkStatusChange: true });

    console.log("userValues :", userValues)

    if(_.isEmpty(userValues.data)){
        return <div />;
    }

    let direction = senderId == user._id  ? "outgoing" : "incoming"
    
    switch(type){
        case "text":{
        switch(direction){
            case "incoming":{
                return  <Message
                            type={type}
                            model={{
                                message,
                                sentTime,
                                sender: senderName,
                                direction,
                                position
                            }}>
                             { userValues.loading ? <LinearProgress sx={{width:"100px"}} /> : <Avatar src={_.isEmpty(userValues.data.user.data) ? "" : userValues.data.user.data.image[0].url} name="Zoe" size="sm" /> }
                            <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />
                        </Message>
            }

            case "outgoing":{
            return  <Message
                        type={type}
                        model={{
                        message,
                        sentTime,
                        sender: senderName,
                        direction,
                        position
                        }}
                    >
                        <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />
                    </Message>
            }
        }

        break;
        }

        case "html":{
        switch(direction){
            case "incoming":{
            return <Message model={{
                        type,
                        direction,
                        position
                    }}>
                        
                        <Message.HtmlContent html={message} />
                        { userValues.loading ? <LinearProgress sx={{width:"100px"}} /> : <Avatar src={_.isEmpty(userValues.data.user.data) ? "" : userValues.data.user.data.image[0].url} name="Zoe" size="sm" /> }
                        <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />
                    </Message>

            }

            case "outgoing":{
            return  <Message model={{
                        type,
                        direction,
                        position
                    }}>
                        <Message.HtmlContent html={message} />
                        <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />
                    </Message>
            }
        }

        break;
        }

        case "image":{
            let { src } = payload[0]
            switch(direction){
                case "incoming":{
                    return  <Message model={{direction, position}}>
                                { userValues.loading ? <LinearProgress sx={{width:"100px"}} /> : <Avatar src={_.isEmpty(userValues.data.user.data) ? "" : userValues.data.user.data.image[0].url} name="Zoe" size="sm" /> }
                                <Message.ImageContent className={"message-image"} src={src} alt={"alt"} width={150} onClick={(event)=>{ console.log("event")}} />
                                <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />   
                            </Message>
                }

                case "outgoing":{
                    return  <Message model={{direction, position}}>
                                <Message.ImageContent className={"message-image"} src={src} alt={"alt"} width={150} onClick={(event)=>{ console.log("event")}} />
                                <Message.Footer sentTime={moment.unix(sentTime/1000).format('hh:mm A')} />  
                            </Message>
                }
            }

        break;
        }
    } 
};

export default MessageItem;