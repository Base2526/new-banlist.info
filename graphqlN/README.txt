# Write your query or mutation here
mutation{
  createRoom(input:{
    name: "Bigc"
    price: 100
  }){
    _id
    name
    price
  }
}

# Write your query or mutation here
mutation{
 updateRoom(
    _id: "626653c464e68000c62e6a32"
    input: {name :"abc", price:3444}
  ){
    # _id
    name
    price
  }
}

query Rom{
  room(_id:"626653c464e68000c62e6a32"){
    name
    price
  }
}

# Write your query or mutation here
mutation{
  deleteRoom(_id:"626653c464e68000c62e6a32"){
    name
    price
  }
}

Get all room
query Rooms{
  rooms{
    name
    price
  }
}

# custom result array
query Rooms{
  rooms{
		status
    data{
      name
      summary
    }
  }
}



// example chat socket.io
https://devrix.com/tutorial/how-to-create-simple-react-chat-application-using-socket-io/