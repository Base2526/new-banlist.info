import _ from "lodash";
import CardActionArea from "@material-ui/core/CardActionArea";
import Avatar from "@mui/material/Avatar";

export const columns = [
          {
            Header: 'Profile',
            accessor: 'files',
            Cell: props =>{
              if(props.value.length < 1){
                return <div />
              }

              console.log("files :", props.value)
              return (
                <div style={{ position: "relative" }}>
                  <CardActionArea style={{ position: "relative", paddingBottom: "10px" }}>
                    <Avatar
                      sx={{
                        height: 100,
                        width: 100
                      }}
                      variant="rounded"
                      alt="Example Alt"
                      src={props.value[0].url}
                      onClick={(e) => {
                        console.log("files props: ", props.value)
                        setLightbox({ isOpen: true, photoIndex: 0, images:props.value })
                      }}
                    />
                  </CardActionArea>
                  <div
                      style={{
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                          padding: "5px",
                          backgroundColor: "#e1dede",
                          color: "#919191"
                      }}
                      >{props.value.length}</div>
                </div>
              );
            }
          },
          {
            Header: 'Title',
            accessor: 'title',
            Cell: props =>{
              return <Link to={`/detail/${props.row.original._id}`}>{props.value}</Link>
            }
          }, 
          {
            Header: 'Detail',
            accessor: 'description',
            Cell: props => {
              return <Box
                      sx={{
                        maxHeight: "inherit",
                        width: "100%",
                        whiteSpace: "initial",
                        lineHeight: "16px"
                      }}>
                      <ReadMoreMaster
                        byWords={true}
                        length={10}
                        ellipsis="...">{props.value}
                      </ReadMoreMaster>
                    </Box>
            }
          },
          {
            Header: 'Comments',
            Cell: props =>{
              let commentValues = useQuery(gqlComment, {
                variables: {postId: props.row.original._id},
                notifyOnNetworkStatusChange: true,
              });
              if(!commentValues.loading){
                if( commentValues.data === undefined || commentValues.data.comment.data.length == 0){
                  return <div />
                }
          
                let count = 0;
                _.map(commentValues.data.comment.data, (v) => {
                  if (v.replies) {
                    count += v.replies.length;
                  }
                });
          
                return  <ButtonWrapper>
                          <Link to={`/comments`}>
                            <button className="editBtn">{commentValues.data.comment.data.length + count}</button>
                          </Link>
                        </ButtonWrapper>
              }
              return <div />
            } 
          },
          {
            Header: 'Bookmark',
            Cell: props =>{
              const bmValus = useQuery(gqlBookmarksByPostId, {
                variables: { postId: props.row.original._id},
                notifyOnNetworkStatusChange: true, 
              });
      
              if( bmValus.data === undefined ){
                return <div />
              }
      
              return  bmValus.loading 
                      ? <LinearProgress sx={{width:"100px"}} />
                      : bmValus.data.bookmarksByPostId.data.length == 0 
                          ? <div /> 
                          : <ButtonWrapper><Link to={`/comments`}>
                              <button className="editBtn">{bmValus.data.bookmarksByPostId.data.length}</button>
                            </Link></ButtonWrapper>
            } 
          }, 
          {
            Header: 'Share',
            Cell: props =>{
              const shareValus = useQuery(gqlShareByPostId, {
                variables: {postId: props.row.original._id},
                notifyOnNetworkStatusChange: true,
              });

              if( shareValus.data === undefined ){
                return <div />
              }
      
              return  shareValus.loading 
                      ? <LinearProgress sx={{width:"100px"}} />
                      : shareValus.data.shareByPostId.data.length == 0 
                          ? <div /> 
                          : <ButtonWrapper><Link to={`/comments`}>
                              <button className="editBtn">{shareValus.data.shareByPostId.data.length}</button>
                            </Link></ButtonWrapper>
            } 
          },
          {
            Header: 'Action',
            Cell: props => {

              console.log("action :", props.row.original)

              let {_id, title}  = props.row.original
              return  <div className="Btn--posts">
                        <Link to={`/post/${_id}/edit`}>
                          <button><EditIcon/> Edit </button>
                        </Link>
                        <button onClick={(e)=>{
                          setOpenDialogDelete({ isOpen: true, id: _id, description: title });
                        }}><DeleteForeverIcon/> Delete</button>
                      </div>
            }
          }]