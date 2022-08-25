// import { ApolloServer } from "apollo-server";

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import cors from 'cors';
import socketIO from 'socket.io';

import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";

import { useServer } from "graphql-ws/lib/use/ws";

// import mongoose from "mongoose";
// import { elastic } from "./elastic"
import connection from './mongo' 

// TODO: import TypeDefs and Resolvers
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

import {Bank, Post, Role, User, Comment, Mail, Socket} from './model'

import jwt from 'jsonwebtoken';

let PORT = process.env.PORT || 4040;

// // TODO: initial and connect to MongoDB
// // mongoose.Promise = global.Promise;
// // mongoose.connect("YOUR_MONGODB_URI", { useNewUrlParser: true });

// // uri
// mongoose.connect(
//   "mongodb://mongo1:27017,mongo2:27017,mongo3:27017/bl?replicaSet=rs",
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false, // optional
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//   }
// );
// const dboose = mongoose.connection;
// dboose.on("error", console.error.bind(console, "mongoose : connection error:"));
// dboose.once("open", async function () {
//   // we're connected!
//   console.log("mongoose : Connected successfully to database!", PORT);
// });

/*
// TODO: create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then( async({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  let exists = await elastic.indices.exists({
    index: process.env.ELASTIC_INDEX,
  });

  console.log("elastic exists.statusCode :", exists.statusCode)
  if (exists.statusCode === 404){
    await elastic.indices.create({
      index: process.env.ELASTIC_INDEX,
      body: {},
    });
  }

  PostModel.watch().on("change", async (data) => {
    console.log("PostModel : change")
  });
});
*/
const bodyParser = require('body-parser');
const path = require('path');
const rfs = require('rotating-file-stream');
// const logger = require('./util/loggerEasy');
const logger = require('./utils/logger');
const { stream } = logger;
const morgan = require('morgan');



async function startApolloServer(typeDefs, resolvers) {
  const app = express();



  /////////////////

  const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs'),
  });
  
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // Morgan
  morgan.token('th-date', function (req, res) {
    const date = new Date();
    return date;
  });
  app.use(morgan('common', { stream: accessLogStream }));
  app.use(
    morgan(
      ':th-date :method[pretty] :url :status :res[content-length] - :response-time ms',
      {
        stream: stream,
      }
    )
  );

  ////////////////

  // Create schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers });



  const httpServer = http.createServer(app);
  /*
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req }) => {
      // console.log("ApolloServer : ", req.headers)

      // https://daily.dev/blog/authentication-and-authorization-in-graphql
      // throw Error("throw Error(user.msg);");

      // const decode = jwt.verify(token, 'secret');

      if (req.headers && req.headers.authorization) {
        var auth    = req.headers.authorization;
        var parts   = auth.split(" ");
        var bearer  = parts[0];
        var token   = parts[1];

        if (bearer == "Bearer") {
          // let decode = jwt.verify(token, process.env.JWT_SECRET);

          try {
            let userId  = jwt.verify(token, process.env.JWT_SECRET);

            
            // code
            // -1 : foce logout
            //  0 : anonymums
            //  1 : OK

            // {status: true, code: 1, data}
            
            return {status: true, code: 1, data: await User.findById(userId)} 
          } catch(err) {
            // logger.error(err.toString());
            console.log(">> ", err.toString())
          }
        }
      }
      return {status: true, code: 0}
    }
  });
  */

  // Set up WebSocket server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);
  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    context: async ({ req }) => {
      console.log("ApolloServer context ")

      // https://daily.dev/blog/authentication-and-authorization-in-graphql
      // throw Error("throw Error(user.msg);");

      // const decode = jwt.verify(token, 'secret');

      if (req.headers && req.headers.authorization) {
        var auth    = req.headers.authorization;
        var parts   = auth.split(" ");
        var bearer  = parts[0];
        var token   = parts[1];

        if (bearer == "Bearer") {
          // let decode = jwt.verify(token, process.env.JWT_SECRET);

          try {
            let userId  = jwt.verify(token, process.env.JWT_SECRET);

            // code
            // -1 : foce logout
            //  0 : anonymums
            //  1 : OK

            // {status: true, code: 1, data}
            
            return {status: true, code: 1, data: await User.findById(userId)} 
          } catch(err) {
            // logger.error(err.toString());
            console.log(">> ", err.toString())
          }
        }
      }
      return {status: true, code: 0}
    }
  });

  await server.start();
  // server.applyMiddleware({ app });

  // let io = socketIO(httpServer)

  app.use(cors())

  server.applyMiddleware({  app, 
                            bodyParserConfig: {
                              limit: '100mb',
                            }
                          });
  let resolve = await new Promise(resolve => httpServer.listen({ port: PORT }, resolve({"status": true})));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}` , resolve);

  await Socket.deleteMany({})

  /*
  io.on('connection', async(soc) => {

    // global.socket = socket
    let handshake = soc.handshake;

    let query = handshake.query;

    console.log('A client connected', soc.id, query.x, JSON.stringify(query) )

    // logger.info(`Ready Listening on port`);
    await Socket.findOneAndUpdate({socketId: soc.id}, {updatedAt: Date.now() }, {
      new: true,
      upsert: true,
    });

    soc.on("disconnect", async () => {
      console.log("A client disconnect", soc.id)

      await Socket.deleteOne({socketId: soc.id })
    })

    ///////////////////

    soc.on("CHANNEL_SWITCH", (data) => {
      const { prevChannel, channel } = data;

      console.log("CHANNEL_SWITCH :", data)
      // if (prevChannel) {
      //   socket.leave(prevChannel);
      // }
      // if (channel) {
      //   socket.join(channel);
      // }
    });

    // soc.on("MESSAGE_SEND", (data) => {

    //   console.log("MESSAGE_SEND :", data)
    //   // addMessage(data);
    //   // const { channel } = data;
    //   // socket.broadcast.to(channel).emit("NEW_MESSAGE", data);
    // });

    soc.on("MESSAGE_SEND" , (arg, callback) => {
      console.log(arg); // "world"
      callback("got it");
    });


    ///////////////////

    // https://stackoverflow.com/questions/20337832/is-socket-io-emit-callback-appropriate
    
    // client send data to server
    
    soc.on('follow', (data, callback) => {
      console.log(`follow received is ${data}`)
      // return {result : "folow function()"}

      callback({data});
    });

  });

  */
}

startApolloServer(typeDefs, resolvers) 
