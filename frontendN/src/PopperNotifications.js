import React, { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import List from '@mui/material/List';
import ListSubheader from "@mui/material/ListSubheader";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash"
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

const PopperNotifications = (props) => {
    const popperRef = useRef();
    let history = useHistory();
    let {popperAnchorEl, setPopperAnchorEl} = props
    let [values, setValues] = useState([{ id: 0, name: "Comments", items: [] }])

    useEffect(()=>{
        window.addEventListener("click", handleClickAway, true);
        return () => {
            window.removeEventListener("click", handleClickAway, true);
        };
    }, [])


    useEffect(()=>{
        values[0]  = {...values[0], items: props.notifications}

        setValues(values)
    }, [props.notifications])

    const handleClickAway = (e)=>{
        // console.log("handleClickAway :", e.target.id, ' >>>> ', popperRef.current, ' ++> ', popperRef.current.contains(e.target))
        try{
            if(e.target.id == "see-all"){
                history.push({ pathname: "/notification" });

                setPopperAnchorEl(null)
            }else if(e.target.id.includes('itempopper')){
                let p = _.find(props.notifications, (item)=>{ return item._id === e.target.id.split('-')[1] })
                history.push({ pathname: "/detail/" + p.input.postId });

                setPopperAnchorEl(null)
            }else if(popperRef.current?.contains(e.target)){
                console.log(">>");
            }else{
                setPopperAnchorEl(null)
            }
        }catch (e) {
            console.log("e :", e) 
        }
    }

    return (<Popper
                ref={popperRef}
                id={"basic-button-22"}
                open={Boolean(popperAnchorEl)}
                anchorEl={popperAnchorEl}
                // role={undefined}
                // placement="bottom-start"
                // transition
                disablePortal
                placement="bottom"
                >
                <Paper>                    
                    <List
                    sx={{
                        width: "100%",
                        maxWidth: 300,
                        width:250,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 450,
                        "& ul": { padding: 0 }
                    }}
                    subheader={
                        <div className="notification-list-subheader">
                            <div>Notifications</div>
                            <Button id={'see-all'} onClick={()=>{
                               
                                setPopperAnchorEl(null);
                            }}>See all</Button>
                        </div>
                    }
                    >
                   {    
                    _.map(values, (v1)=>(
                        <li key={`section-${v1.id}`}>
                            <ul>
                            <ListSubheader>{v1.name}</ListSubheader>
                            {
                                _.map(v1.items, (item)=>{
                                    console.log(">>>", item)
                                    return  <div>
                                                <div id={`itempopper-${item._id}`} >{item.text.replace(/<[^>]+>/g, '')}</div>
                                            </div>
                                })
                            }
                            </ul>
                        </li>
                    ))
                   } 
                    </List>                
                </Paper>
            </Popper>)
}

const mapStateToProps = (state, ownProps) => {
    let notifications = _.orderBy(state.auth.notifications, (o) => { return moment(o.createdAt); }, ['desc']);
    return {
      user: state.auth.user,
      notifications
    }
};

export default connect( mapStateToProps, null )(PopperNotifications);