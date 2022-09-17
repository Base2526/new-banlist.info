import jwt from 'jsonwebtoken';
import { withFilter } from 'graphql-subscriptions';
import _ from "lodash";

import deepdash from "deepdash";
deepdash(_);

// const {
//   GraphQLUpload,
//   graphqlUploadExpress, // A Koa implementation is also exported.
// } = require('graphql-upload');
import * as fs from "fs";

import {Bank, 
        Post, 
        Role, 
        User, 
        Comment, 
        Mail, 
        Socket, 
        Bookmark, 
        ContactUs, 
        tContactUs, 
        Share, 
        Dblog,
        Conversation,
        Message,
        BasicContent,
        Follow,
        Session,
        Notification,
        Phone} from './model'
import {emailValidate} from './utils'
import pubsub from './pubsub'

import {fileRenamer} from "./utils"
import { __TypeKind } from 'graphql';

const path = require('path');

// const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');

let logger = require("./utils/logger");



export default {
  Query: {
    // user
    async user(parent, args, context, info) {
      let start = Date.now()

      if(!context.status){
        // foce logout
      }

      let {_id} = args

      if(_.isEmpty(_id)){
        return;
      }

      let data = await User.findById(_id);
      return {
        status:true,
        messages: "", 
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    async users(parent, args, context, info) {
      try{
        let start = Date.now()
        let {page, perPage} = args
        let data = await  User.find({}).limit(perPage).skip(page); 
        let total = (await User.find({})).length;

        return {
          status:true,
          data,
          total,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }

      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async getManyUsers(root, {
      _ids
    }) {
      console.log("getManyUsers :", _ids)

      let start = Date.now()

      let data =  await User.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // user

    // homes
    async homes(parent, args, context, info) {
      try{

        let { userId, page, perPage, keywordSearch, category } = args
        let start = Date.now()

        // if(_.isEmpty(userId)){
          
        // }

        // let {currentUser} = context 
        // currentUser._id.toString()
        // console.log("homes :", currentUser)

        // console.log("Homes: page : ", page,
        //             ", perPage : ", perPage, 
        //             ", keywordSearch : ", keywordSearch,
        //             ", category : ", category , 
        //             `Time to execute = ${
        //               (Date.now() - start) / 1000
        //             } seconds` )

        

        /*
        0 : ชื่อเรื่อง | title
        1 : ชื่อ-นามสกุล บัญชีผู้รับเงินโอน | nameSubname
        2 : เลขบัตรประชาชนคนขาย | idCard
        3 : บัญชีธนาคาร | banks[]
        4 : เบอร์โทรศัพท์ | tels[]
        */

        if(!context.status){
          // foce logout
        }

        let data = null;
        let total = 0;

        page    = parseInt(page)
        perPage = parseInt(perPage)

        let skip =  page == 0 ? page : (perPage * page) + 1;
      
        // console.log("keywordSearch ::", !!keywordSearch, keywordSearch)
        if(!!keywordSearch){
          keywordSearch = keywordSearch.trim()
          
          category = category.split(',');

          let regex = [];
          if(category.includes("0")){
            regex = [...regex, {title: { $regex: '.*' + keywordSearch + '.*', $options: 'i' } }]
          }

          if(category.includes("1")){
            regex = [...regex, {nameSubname: { $regex: '.*' + keywordSearch + '.*', $options: 'i' } }]
          }

          if(category.includes("2")){
            regex = [...regex, {idCard: { $regex: '.*' + keywordSearch + '.*', $options: 'i' } }]
          }

          if(category.includes("3")){
            regex = [...regex, {"banks.bankAccountName": { $in: [keywordSearch] } }]
          }

          if(category.includes("4")){
            regex = [...regex, {tels: { $in: [keywordSearch] } }]
          }
          
          data = await Post.find({ $or: regex }).limit(perPage).skip(skip);

          console.log("regex :", data, regex)


          total = (await Post.find().lean().exec()).length; 
        }else{
          data = await Post.find().limit(perPage).skip(skip); 

          total = (await Post.find().lean().exec()).length;
        }
        // console.log("homes total , skip :", total, skip, context.currentUser)

        let new_data = await Promise.all( _.map(data, async(v)=>{
                          return {...v._doc, shares: await Share.find({postId: v._id})}
                        }))

        return {
          status:true,
          data: new_data,
          total,
          executionTime: `Time to execute = ${
            (Date.now() - start) / 1000
          }`,
        }
      } catch(err) {
        logger.error(err.toString());
        console.log("homes err :", args, err.toString())
        return;
      }
    },
    // homes

    // post
    async post(parent, args, context, info) {
      try{
        // if(!context.status){
        //   // foce logout
        // }

        let start = Date.now()

        let { _id } = args
        
        console.log("args :", args)

        let data = await Post.findById(_id);

        console.log("post :", data, _id)
        return {
          status:true,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`,
          data
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async posts(parent, args, context, info) {

      // let {currentUser} = context 
      
      // console.log("posts currentUser :", currentUser, args)
      let { userId, page, perPage } = args

      let start = Date.now()

      console.log("Posts: page : ", page,
                  ", perPage : ", perPage, 
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await  Post.find({ownerId: userId}).limit(perPage).skip(page); 
      let total = (await Post.find({ownerId: userId}).lean().exec()).length;

      return {
        status:true,
        data,
        total,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async postsByUser(root, {
      userId
    }) {

      let start = Date.now()

      // console.log("postsByUser : ", userId)
      
      let data = await  Post.find({ownerId: userId}); 
      return {
        status:true,
        data,
        total: data.length,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    async getManyPosts(root, {
      _ids
    }) {
      console.log("getManyPosts :", _ids)

      let start = Date.now()
      let data =  await Post.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // post

    // Role
    async role(parent, args, context, info) {

      try{
        let start = Date.now()

        let {_id} = args
        let data = await Role.findById(_id);
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }

      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async roles(parent, args, context, info) {

      try{
        let start = Date.now()
        let data = await Role.find();
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async getManyRoles(root, {
      _ids
    }) {
      console.log("getManyRoles :", _ids)

      let start = Date.now()
      let data =  await Role.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Role

    // Bank
    async bank(parent, args, context, info) {
      try{
        let start = Date.now()
        let { _id } = args
        let data = await Bank.findById(_id);
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async banks(parent, args, context, info) {
      try{
        let start = Date.now()
        let data = await Bank.find();

        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async getManyBanks(root, {
      _ids
    }) {
      console.log("getManyBanks :", _ids)

      let start = Date.now()


      let data =  await Bank.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Bank

    // BasicContent
    async basicContent(parent, args, context, info) {
      try{
        let start = Date.now()

        let { _id } = args
        let data = await BasicContent.findById(_id);

        return { 
          status:true, 
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds` }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async basicContents(parent, args, context, info) {
      try{
        let start = Date.now()
        let data = await BasicContent.find();
        
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    // BasicContent

    // Mail
    async Mail(root, {
      _id
    }) {

      let data = await Mail.findById(_id);
      return {
        status:true,
        data
      }
    },
    async Mails(root, {
      page,
      perPage
    }) {

      let start = Date.now()

      console.log("Mails: page : ", page,
                  ", perPage : ", perPage,
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Mail.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    async getManyMails(root, {
      _ids
    }) {
      console.log("getManyMails :", _ids)

      let start = Date.now()


      let data =  await Mail.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Mail

    // Socket
    async socket(parent, args, context, info) {

      try{
        let start = Date.now()

        let {_id} = args

        let data = await Socket.findById(_id);
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
      
    },
    async sockets(parent, args, context, info) {
      try{
        let start = Date.now()
        let data = await Socket.find();

        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async getManySockets(parent, args, context, info) {
      try{
        let {_ids} = args

        let start = Date.now()
        let data =  await Socket.find({_id: { $in: _ids }})

        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    // Socket

    // Comment 
    async comment(parent, args, context, info) {
      let start = Date.now()

      let { postId } = args
      // console.log("Comment: ", postId)

      let data = await Comment.findOne({postId: postId});

      // console.log("Comment > data : ", data)
      
      return {
        status:true,
        data: _.isEmpty(data) ? [] : data.data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async getManyReferenceComment(root, {
      postId,
      page,
      perPage, 
      sortField,
      sortOrder, 
      filter
    }) {

      let start = Date.now()

      console.log("Comments: page : ", page,
                  ", perPage : ", perPage, 
                  ", sortField : ", sortField,
                  ", sortOrder : ", sortOrder, 
                  ", filter : ", JSON.parse(JSON.stringify(filter)),
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      // let data = await Comment.find();

      // let data = await User.find();
      let data = await  Comment.find({postId}).limit(perPage).skip(page).sort({[sortField]: sortOrder === 'ASC' ? 1 : -1 });

      let total = (await Comment.find({postId}).sort({[sortField]: sortOrder === 'ASC' ? 1 : -1 })).length;
      console.log("total  ", total)

      return {
        status:true,
        data,
        total,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    // Comment

    async Bookmarks(root, {
      page,
      perPage
    }) {
      let start = Date.now()
      let data = await Bookmark.find();
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async bookmarksByPostId(root, {
      postId
    }) {
      let start = Date.now()
      let data  = await Bookmark.find({ postId });
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async isBookmark(parent, args, context, info) {
      let start = Date.now()

      let { userId, postId } = args

      if(_.isEmpty(userId)){
        return ;
      }

      let data =await Bookmark.findOne({ userId, postId });

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    // 
    async bookmarksByUserId(parent, args, context, info) {
      let start = Date.now()
      let { userId } = args

      let data  = await Bookmark.find({ userId, status:true });
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    // isFollow(userId: ID!, friendId: ID!): FollowPayLoad
    async isFollow(root, {
      userId,
      friendId
    }) {
      let start = Date.now()
      let data =await Follow.findOne({ userId, friendId });

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async follower(root, {
      userId
    }) {

      let start = Date.now()
      let follows =await Follow.find({ friendId: userId, status: true  });

      let data =  await Promise.all(_.map(follows, async(v)=>{ return await User.findById(v.userId) }))

      return {
        status:true,
        data: data,
        total: data.length,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async followingByUserId(root, {
      userId
    }) {
      console.log("followingByUserId : ", userId)
      let start = Date.now()
      let data =await Follow.find({ userId: userId, status: true  });

      console.log("followingByUserId data : ", data)
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },


    // 
    async ContactUsList(root, {
      page,
      perPage
    }) {
      let start = Date.now()
      let data = await ContactUs.find();
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    /////
    async TContactUs(root, {
      _id
    }) {

      let data = await tContactUs.findById(_id);
      return {
        status:true,
        data
      }
    },
    async TContactUsList(root, {
      page,
      perPage
    }) {

      let start = Date.now()

      console.log("TContactUsList: page : ", page,
                  ", perPage : ", perPage, 
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await tContactUs.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    async getManyTContactUsList(root, {
      _ids
    }) {
      console.log("getManyTContactUsList :", _ids)

      let start = Date.now()

      let data =  await tContactUs.find({_id: {
        $in: _ids,
      }})

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },
    /////


    /////
    async shares(root, {
      page,
      perPage
    }) {

      let start = Date.now()
      console.log("Shares: page : ", page,
                  ", perPage : ", perPage, 
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )

      let data = await Share.find();

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async shareByPostId(parent, args, context, info) {

      let start = Date.now()

      let { postId } = args
      // console.log("ShareByPostId  postId: ", postId,
      //             ", page : ", page, 
      //             ", perPage : ", perPage, 
      //             `Time to execute = ${
      //               (Date.now() - start) / 1000
      //             } seconds` )

      let data = await Share.find({postId: postId});
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async Dblog(root, {
      page,
      perPage
    }) {

      let start = Date.now()
      console.log("Dblog  : ", page, 
                  ", perPage : ", perPage, 
                  `Time to execute = ${
                    (Date.now() - start) / 1000
                  } seconds` )
            
      let skip =  page == 0 ? page : (perPage * page) + 1;
      let data = await Dblog.find({}).limit(perPage).skip(skip);

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    // 
    async conversations(parent, args, context, info) {

      let start = Date.now()
      // let { currentUser } = context

      // console.log("conversations :", currentUser)

      // if(_.isEmpty(currentUser) ){
      //   return;
      // }

      let { userId } = args

      let data=  await Conversation.find({
        "members.userId": { $all: [ userId ] }
      });
    
      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
    },

    async notifications(parent, args, context, info) {
      try{
        let start = Date.now()
        let { userId } = args

        let data=  await Notification.find({ user_to_notify: userId });

        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }

      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },

    async fetchMessage(parent, args, context, info) {
      let start = Date.now()

      // let { currentUser } = context

      // if(_.isEmpty(currentUser) ){
      //   return;
      // }

      let { conversationId } = args

      if(_.isEmpty(conversationId)){
        return ;
      }

      let data = await Message.find({ conversationId });

      // let newData = data.map(({ _id: id, ...rest }) => ({
      //   id,
      //   ...rest,
      // }));

      return {
        status:true,
        data,
        executionTime: `Time to execute = ${
          (Date.now() - start) / 1000
        } seconds`
      }
      
    },

    async phones(parent, args, context, info) {
      try{
        let start = Date.now()        
        let { userId, page, perPage } = args

        let roles = (await User.findById(userId)).roles

        let data = await  Phone.find({ownerId: userId}).limit(perPage).skip(page); 
        let total = (await Phone.find({ownerId: userId}).lean().exec()).length;

        //  62a2ccfbcf7946010d3c74a2 :: administrator
        //  62a2ccfbcf7946010d3c74a6 :: authenticated

        // administrator
        if(roles.includes('62a2ccfbcf7946010d3c74a2')){
          data = await  Phone.find().limit(perPage).skip(page); 
          total = (await Phone.find().lean().exec()).length;
        }

        return {
          status:true,
          data,
          total,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async phone(parent, args, context, info) {
      try{
        let start = Date.now()

        let {_id} = args

        let data = await Phone.findById(_id);
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
  },
  Upload: GraphQLUpload,
  Mutation: {

    async currentNumber(parent, args, context, info) {
      let currentNumber = Math.floor(Math.random() * 1000);

      pubsub.publish("NUMBER_INCREMENTED", { numberIncrementedx: currentNumber });
      return currentNumber;
    },

    // Login & Logout
    async login(parent, args, context, info) {
      try{
        let {input} = args

        let start = Date.now()
        let user = emailValidate().test(input.username) ?  await User.findOne({email: input.username}) : await User.findOne({username: input.username})

        if(user === null){
          return {
            status: false,
            messages: "xxx", 
            data:{
              _id: "",
              username: "",
              password: "",
              email: "",
              displayName: "",
              roles:[]
            },
            executionTime: `Time to execute = ${
              (Date.now() - start) / 1000
            } seconds`
          }
        }

        // update lastAccess
        await User.findOneAndUpdate({
          _id: user._doc._id
        }, {
          lastAccess : Date.now()
        }, {
          new: true
        })

        // let roles = await Promise.all(_.map(user.roles, async(_id)=>{
        //   let role = await Role.findById(_id)
        //   return role.name
        // }))

        // console.log("Login #1: ", user.roles )

        // user = { ...user._doc,  roles }
        // console.log("Login #2: ", user )

        let token = jwt.sign(user._id.toString(), process.env.JWT_SECRET)

        input = {...input, token}
        await Session.create(input);

        return {
          status: true,
          messages: "", 
          token,
          data: user,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }

      } catch(err) {
        logger.error(err.toString());

        console.log("login : ", err.toString())
        return;
      }
    },
    // loginWithSocial
    async loginWithSocial(root, {
      input
    }) {
      console.log("loginWithSocial :", input)
      // input = {...input, displayName: input.username}
      // return await User.create(input);

      return {_id: "12222"}
    },
    // user
    async createUser(parent, args, context, info) {
      
      if(_.isEmpty(context)){
        // logger.error(JSON.stringify(args));
        return;
      }

      let {input} = args

      input = {...input, displayName: input.username}
      return await User.create(input);
    },
    async updateUser(parent, args, context, info) {

      try{
        let { _id,  input} = args
        
        if(!_.isEmpty(input.files)){
          let newFiles = [];

          const { createReadStream, filename, encoding, mimetype } = (await input.files).file

          const stream = createReadStream();
          const assetUniqName = fileRenamer(filename);
          let pathName = `/app/uploads/${assetUniqName}`;
          
          const output = fs.createWriteStream(pathName)
          stream.pipe(output);

          await new Promise(function (resolve, reject) {
            output.on('close', () => {
              resolve();
            });
      
            output.on('error', (err) => {
              logger.error(err.toString());

              reject(err);
            });
          });

          newFiles.push({ url: `${process.env.RA_HOST}${assetUniqName}`, filename, encoding, mimetype });
        
        
          input = {...input, image: newFiles}
        }

        delete input.files;

        return await User.findOneAndUpdate({ _id }, input, { new: true })
      } catch(err) {
        logger.error(err.toString());

        console.log("UpdateUser err :", err.toString())
        return;
      }
    },
    async deleteUser(parent, args, context, info){
      try{
        let { _id } = args
        console.log("deleteUser :", _id)

        let user = await User.findByIdAndRemove({_id})

        // pubsub.publish('POST', {
        //   post:{
        //       mutation: 'DELETED',
        //       data: post
        //   }
        // });
        
        return user;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    // user

    /*
    (parent, args, context, info) {
      // let { currentUser } = context

      // if(_.isEmpty(currentUser)){
      //   return;
      // }

      console.log("addMessage : ", args)

      let { userId, conversationId, input } = args


      ///////////////////////
      if(input.type === "image"){
        let {payload, files} = input

        let url = [];
        for (let i = 0; i < files.length; i++) {
    */

    // post
    async createPost(parent, args, context, info){
      try{
        let { input } = args

        let post = null;
        if(!input?.fake){
          let newFiles = [];

          // console.log("input.files :", input.files, _.isEmpty(input.files) ? "Y" : "N")
          if(!_.isEmpty(input.files)){
            // console.log("createPost :", input.files)
            
            for (let i = 0; i < input.files.length; i++) {
  
              console.log("updatePost #1234:", await input.files[i])
              const { createReadStream, filename, encoding, mimetype } = (await input.files[i]).file //await input.files[i];
  
              const stream = createReadStream();
              const assetUniqName = fileRenamer(filename);
              let pathName = `/app/uploads/${assetUniqName}`;
    
              const output = fs.createWriteStream(pathName)
              stream.pipe(output);
    
              await new Promise(function (resolve, reject) {
                output.on('close', () => {
                  resolve();
                });
          
                output.on('error', (err) => {
                  logger.error(err.toString());
    
                  reject(err);
                });
              });
    
              const urlForArray = `${process.env.RA_HOST}${assetUniqName}`;
              newFiles.push({ url: urlForArray, filename, encoding, mimetype });
            }
  
            console.log("newFiles :", newFiles)
  
          }
  
          post = await Post.create({...input, files:newFiles});
        }else{
          post = await Post.create(input);
        }


        console.log("createPost #1 :", input)
        pubsub.publish('POST', {
          post:{
            mutation: 'CREATED',
            data: post
          }
        });

        return post;
      } catch(err) {
        logger.error(err.toString());

        console.log("createPost #2 :", err.toString())
        return;
      }
    },

    async updatePost(parent, args, context, info) {
      
      try{
        let { _id, input } = args
        let newFiles = [];
        if(!_.isEmpty(input.files)){

          for (let i = 0; i < input.files.length; i++) {
            try{
              let fileObject = (await input.files[i]).file

              if(!_.isEmpty(fileObject)){
                const { createReadStream, filename, encoding, mimetype } = fileObject //await input.files[i];
                const stream = createReadStream();
                const assetUniqName = fileRenamer(filename);
                let pathName = `/app/uploads/${assetUniqName}`;
                
      
                const output = fs.createWriteStream(pathName)
                stream.pipe(output);
      
                await new Promise(function (resolve, reject) {
                  output.on('close', () => {
                    resolve();
                  });
            
                  output.on('error', (err) => {
                    logger.error(err.toString());
      
                    reject(err);
                  });
                });
      
                const urlForArray = `${process.env.RA_HOST}${assetUniqName}`;
                newFiles.push({ url: urlForArray, filename, encoding, mimetype });
              }else{
                if(input.files[i].delete){
                  let pathUnlink = '/app/uploads/' + input.files[i].url.split('/').pop()
                  fs.unlink(pathUnlink, (err)=>{
                      if (err) {
                        logger.error(err);
                      }else{
                        // if no error, file has been deleted successfully
                        console.log('File has been deleted successfully ', pathUnlink);
                      }
                  });
                }else{
                  newFiles = [...newFiles, input.files[i]]
                }
              }
              // console.log("updatePost #6:", newFiles)
            } catch(err) {
              logger.error(err.toString());
            }
          }
        }

        let newInput = {...input, files:newFiles}

        let post = await Post.findOneAndUpdate({
          _id
        }, newInput, {
          new: true
        });

        // console.log("updatePost :", _id , post)

        pubsub.publish("POST", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });

        return post;
      } catch(err) {
        logger.error(err.toString());
        return;
      }

    
    },

    async deletePost(parent, args, context, info) {
      try{
        let { _id } = args
        console.log("deletePost :", _id)

        let post = await Post.findByIdAndRemove({_id})

        pubsub.publish('POST', {
          post:{
              mutation: 'DELETED',
              data: post
          }
        });
        
        return post;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },

    // deletePosts
    async deletePosts(root, {
      _ids
    }) {
      
      console.log("deletePosts :",JSON.parse(JSON.stringify(_ids)))

      let deleteMany =  await Post.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },

    // post

    // role     
    async createRole(parent, args, context, info) {
      try{
        let { input } = args
        return await Role.create(JSON.parse(JSON.stringify(input)));
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async updateRole(parent, args, context, info) {
      try{
        let { _id, input } = args
      
        return await Role.findOneAndUpdate({ _id }, input, { new: true })
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deleteRole(parent, args, context, info) {
      try{
        let { _id } = args

        return await Role.findByIdAndRemove({_id})
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deleteRoles(parent, args, context, info) {
      try{
        let { _ids } = args

        return await Role.deleteMany({_id: { $in: _ids }});
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    // role

    // bank
    async createBank(parent, args, context, info){
      try{
        let { input } = args
        return await Bank.create(JSON.parse(JSON.stringify(input)));
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async updateBank(parent, args, context, info) {
      try{
        let {_id, input } = args
        
        return await Bank.findOneAndUpdate({ _id }, input, { new: true })
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deleteBank(parent, args, context, info) {
      try{
        let { _id } = args
        console.log("deleteBank :", _id)

        let bank = await Bank.findByIdAndRemove({_id})

        // pubsub.publish('POST', {
        //   post:{
        //       mutation: 'DELETED',
        //       data: post
        //   }
        // });
        
        return bank;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deleteBanks(root, {
      _ids
    }) {
      console.log("deleteBanks :", _ids)

      let deleteMany =  await Bank.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },
    // bank


   // basic content

    async createBasicContent(root, {
      input
    }) {
      console.log("CreateBasicContent :",JSON.parse(JSON.stringify(input)))

      return await BasicContent.create(JSON.parse(JSON.stringify(input)));
    },
    async updateBasicContent(parent, args, context, info) {
      try{
        let { _id, input } = args

        return await BasicContent.findOneAndUpdate({ _id }, input, { new: true })
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deleteBasicContent(parent, args, context, info) {
      try{
        let { _id } = args
        console.log("deleteBasicContent :", _id)

        let basicContent = await BasicContent.findByIdAndRemove({_id})

        // pubsub.publish('POST', {
        //   post:{
        //       mutation: 'DELETED',
        //       data: post
        //   }
        // });
        
        return basicContent;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },

   // basic content

    // mail
    async createMail(root, {
      input
    }) {
      console.log("createMail :",JSON.parse(JSON.stringify(input)))

      return await Mail.create(JSON.parse(JSON.stringify(input)));
    },
    async updateMail(root, {
      _id,
      input
    }) {
      console.log("updateMail :", _id, JSON.parse(JSON.stringify(input)))
      
      return await Mail.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteMail(root, {
      _id
    }) {
      console.log("deleteMail :", _id)

      return await Mail.findByIdAndRemove({_id})
    },
    async deleteMails(root, {
      _ids
    }) {
      console.log("deleteMails :", _ids)

      let deleteMany =  await Mail.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },


    // mail

    // comment
    async createAndUpdateComment(parent, args, context, info) {

      let {input} = args

      let start = Date.now()

      // console.log("createAndUpdateComment #1 :", input )
      // console.log("createAndUpdateComment #2 :", _.omitDeep(input, ['notify']) )

      let {postId, data} = input

     

      let resultComment = await Comment.findOneAndUpdate({
        postId: input.postId
      }, input, {
        new: true
      })
      
      if(resultComment === null){
        resultComment = await Comment.create(input);

        pubsub.publish("COMMENT", {
          comment: {
            mutation: "CREATED",
            commentID: input.postId,
            data: resultComment.data,
          },
        });
      }else{
        pubsub.publish("COMMENT", {
          comment: {
            mutation: "UPDATED",
            commentID: input.postId,
            data: resultComment.data,
          },
        });
      }

      ////////////////// send notification //////////////////

      input = {...input, commentID: resultComment._id.toString()}

      _.map(input.data, async(item)=>{
        // replies  notify
        if(item.notify){
          // item.userId

          // หาเจ้าของ โพส แล้วส่ง notify ไปหา เจ้าของโพส
          let post = await Post.findById(postId);
          if(post){
            let {ownerId} = post

            if(ownerId !== item.userId){

              let resultNoti = await Notification.create({
                                                        user_to_notify: ownerId,
                                                        user_who_fired_event: item.userId,
                                                        type: "comment",
                                                        text: item.text,
                                                        status: "send",
                                                        input
                                                      });

              pubsub.publish("NOTIFICATION", {
                notification: {
                  mutation: "CREATED",
                  data: resultNoti,
                },
              });
            }
          }
        }

        _.map(item.replies, async(replie)=>{
          if(replie.notify){

            console.log("#2 :", item.userId, replie.userId)

            if(item.userId !== replie.userId){

              let resultNoti =  await Notification.create({
                                          user_to_notify: item.userId,
                                          user_who_fired_event: replie.userId,
                                          type: "comment",
                                          text: replie.text,
                                          status: "send",
                                          input
                                        });

              pubsub.publish("NOTIFICATION", {
                notification: {
                  mutation: "CREATED",
                  data: resultNoti,
                },
              });
            }
          }
        })
      })

      ////////////////// send notification //////////////////
                
      return {
        status:true,
        data: resultComment.data,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },

    async updateComment(root, {
      _id,
      input
    }) {
      console.log("updateComment :", _id, JSON.parse(JSON.stringify(input)))
      
      return await Comment.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },

    async deleteComment(root, {
      _id
    }) {
      console.log("deleteComment :", _id)

      return await Comment.findByIdAndRemove({_id})
    },
    async deleteComment(root, {
      _ids
    }) {
      console.log("deleteComment :", _ids)

      let deleteMany =  await Comment.deleteMany({_id: {
        $in: _ids,
      }})
      return deleteMany;
    },
    // comment
    
    async createAndUpdateBookmark(parent, args, context, info) {

      if(_.isEmpty(context)){
        // logger.error(JSON.stringify(args));
        return;
      }

      let {input} = args

      /**
       * validate data
      */
      if(_.isEmpty(await Post.findById(input.postId))){
        // logger.error("Post id empty :", input.postId)
        return;
      } 

      if(_.isEmpty(await User.findById(input.userId))){
        // logger.error("User id empty :", input.userId)
        return;
      } 
      /**
       * validate data
      */

      let result = await Bookmark.findOneAndUpdate({
        postId: input.postId
      }, input, {
        new: true
      })
     
      if(result === null){
        result = await Bookmark.create(input);

        pubsub.publish("BOOKMARK", {
          bookmark: {
            mutation: "CREATED",
            data: result,
          },
        });
      }else{

        pubsub.publish("BOOKMARK", {
          bookmark: {
            mutation: "UPDATED",
            data: result,
          },
        });
      }

      return result;
    },
    async createAndUpdateFollow(parent, args, context, info) {

      if(_.isEmpty(context)){
        // logger.error(JSON.stringify(args));
        return;
      }
      
      let {input} = args

      /**
       * validate data
      */
      if(_.isEmpty(await User.findById(input.userId))){
        // logger.error("User id empty :", input.userId)
        return;
      } 

      if(_.isEmpty(await User.findById(input.friendId))){
        // logger.error("User id empty :", input.friendId)
        return;
      } 
      /**
       * validate data
      */

      let result = await Follow.findOneAndUpdate({
        userId: input.userId, friendId: input.friendId
      }, input, {
        new: true
      })
     
      if(result === null){
        result = await Follow.create(input);
      }

      return result;
    },
    // TContactUs
    async createTContactUs(root, {
      input
    }) {
      console.log("createTContactUs")

      return await tContactUs.create(input);
    },
    async updateTContactUs(root, {
      _id,
      input
    }) {
      console.log("updateTContactUs :", _id )
      
      return await tContactUs.findOneAndUpdate({
        _id
      }, input, {
        new: true
      })
    },
    async deleteTContactUs(root, {
      _id
    }) {
      console.log("deleteTContactUs :", _id)

      return await tContactUs.findByIdAndRemove({_id})
    },
    async deleteTContactUsList(root, {
      _ids
    }) {
      console.log("deleteTContactUsList :", _ids)
      return await tContactUs.deleteMany({_id: {
        $in: _ids,
      }})
    },
    // TContactUs

    async createContactUs(parent, args, context, info) {

      if(_.isEmpty(context)){
        // logger.error(JSON.stringify(args));
        return;
      }

      let {input} = args

      /**
       * validate data
      */
      if(_.isEmpty(await Post.findById(input.postId))){
        // logger.error("Post id empty : ", input.postId)
        return;
      } 

      if(_.isEmpty(await User.findById(input.userId))){
        // logger.error("User id empty : ", input.userId)
        return;
      } 
      /**
       * validate data
      */

      return await ContactUs.create(input);
    },
    async createShare(parent, args, context, info) {

      let {input} = args
      let share = await Share.create(input);

      console.log("createShare :", share)

      pubsub.publish("SHARE", {
        share: {
          mutation: "CREATED",
          data: share,
        },
      });

      return share;
    },
    async createConversation(parent, args, context, info) {
      try{
        let {input} = args
        
        let currentUser = await User.findById(input.userId);
        let friend = await User.findById(input.friendId);

        let result =  await Conversation.findOne({ "members.userId": { $all: [ currentUser._id.toString(), input.friendId ] } });
                        
        if(result === null){
          result = await Conversation.create({
            // name: friend.displayName,
            lastSenderName: currentUser.displayName,
            info:"",
            // avatarSrc: _.isEmpty(friend.image) ? "" :  friend.image[0].base64,
            // avatarName: friend.displayName,
            senderId: currentUser._id.toString(),
            status: "available",
            // unreadCnt: 0,
            sentTime: Date.now(),
            // userId: input.friendId,
            // members: [input.userId, input.friendId],
            // members: {[input.userId]:{ 
            //                           name: currentUser.displayName, 
            //                           avatarSrc: _.isEmpty(currentUser.image) ? "" :  currentUser.image[0].base64,
            //                           unreadCnt: 0 
            //                         }, 
            //           [input.friendId]:{ 
            //                           name: friend.displayName, 
            //                           avatarSrc: _.isEmpty(friend.image) ? "" :  friend.image[0].base64,
            //                           unreadCnt: 0 
            //                         }},
            members:[
              { 
                userId: currentUser._id.toString(),
                name: currentUser.displayName, 
                avatarSrc: _.isEmpty(currentUser.image) ? "" :  currentUser.image[0].url,
                unreadCnt: 0 
              },
              {
                userId: input.friendId,
                name: friend.displayName, 
                avatarSrc: _.isEmpty(friend.image) ? "" :  friend.image[0].url,
                unreadCnt: 0 
              }
            ]
          });

          pubsub.publish("CONVERSATION", {
            conversation: {
              mutation: "CREATED",
              data: result,
            },
          });
        }else{
          pubsub.publish("CONVERSATION", {
            conversation: {
              mutation: "UPDATED",
              data: result,
            },
          });
        }
        
        return result;

      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async updateConversation(parent, args, context, info) {
      try{
        let {_id, input} = args

        let result = await Conversation.findOneAndUpdate({
          _id
        }, input, {
          new: true
        })

        pubsub.publish("CONVERSATION", {
          conversation: {
            mutation: "UPDATED",
            data: result,
          },
        });

        console.log("updateConversation friend : ", result)

        return result;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async addMessage(parent, args, context, info) {
      // let { currentUser } = context

      // if(_.isEmpty(currentUser)){
      //   return;
      // }

      console.log("addMessage : ", args)

      let { userId, conversationId, input } = args


      ///////////////////////
      if(input.type === "image"){
        let {payload, files} = input

        let url = [];
        for (let i = 0; i < files.length; i++) {
          const { createReadStream, filename, encoding, mimetype } = await files[i];
          const stream = createReadStream();
          const assetUniqName = fileRenamer(filename);
          let pathName = `/app/uploads/${assetUniqName}`;
          

          const output = fs.createWriteStream(pathName)
          stream.pipe(output);

          await new Promise(function (resolve, reject) {
            output.on('close', () => {
              resolve();
            });
      
            output.on('error', (err) => {
              logger.error(err.toString());

              reject(err);
            });
          });

          const urlForArray = `${process.env.RA_HOST}${assetUniqName}`;
          url.push({ url: urlForArray });
        }

        input = {...input, payload: _.map(payload, (p, index)=>{ return {...p, src: url[index].url} })}
        input = _.omit(input, ['files'])
      }

      /////////////////////////

      let result = await Message.findById(input._id);

      let currentUser = await User.findById(userId);
      
      if(_.isEmpty(result)){
        input = { ...input, 
                  conversationId, 
                  senderId: currentUser._id.toString(), 
                  senderName: currentUser.displayName, 
                  sentTime: Date.now(), 
                  status: "sent",
                  reads: []}
         
        result = await Message.create(input);

        try {
          let conversation = await Conversation.findById(conversationId);
  
          if(!_.isEmpty(conversation)){
            conversation = _.omit({...conversation._doc}, ["_id", "__v"])
  
            let newMember = _.find(conversation.members, member => member.userId != currentUser._id.toString());
  
  
            // หาจำนวน unread total = (await Post.find().lean().exec()).length; 
            // https://www.educative.io/answers/what-is-the-ne-operator-in-mongodb
            let unreadCnt = (await Message.find({ conversationId, 
                                                  senderId: {$all : currentUser._id.toString()}, 
                                                  status: 'sent',
                                                  reads: { $nin: [ newMember.userId ] }}).lean().exec()).length; 
            // หาจำนวน unread
  
            newMember = {...newMember, unreadCnt}
            
            let newMembers = _.map(conversation.members, (member)=>member.userId == newMember.userId ? newMember : member)
  
            conversation = {...conversation, lastSenderName:currentUser.displayName, info:input.message, sentTime: Date.now(), members: newMembers }
  
            let conversat = await Conversation.findOneAndUpdate({ _id : conversationId }, conversation, { new: true })
  
            let p = pubsub.publish("CONVERSATION", {
              conversation: {
                mutation: "UPDATED",
                data: conversat,
              },
            });
          }
        } catch (err) {
          console.log("conversation err:" , err)
        }

        pubsub.publish('MESSAGE', {
          message:{
            mutation: 'CREATED',
            data: result
          }
        });
      }

      return result;
    },
    async updateMessageRead(parent, args, context, info) {
      let { userId, conversationId } = args

      // console.log("updateMessageRead :", userId, conversationId)

      // let currentUser = await User.findById(userId);

      let conversation = await Conversation.findById(conversationId);

      if(!_.isEmpty(conversation)){

        // update all message to read
        await Message.updateMany({
            conversationId, 
            senderId: { $nin: [ userId ] },
            status: 'sent',
            reads: { $nin: [ userId ] }
          }, 
          // {$set: {reads: [ userId ] }}
          { $push: {reads: userId } }
        )

        // update conversation  unreadCnt = 0
        conversation = _.omit({...conversation._doc}, ["_id", "__v"])
    
        conversation = {...conversation, members: _.map(conversation.members, (member)=>member.userId == userId ? {...member, unreadCnt:0} : member) }

        let newConversation = await Conversation.findOneAndUpdate({ _id : conversationId }, conversation, { new: true })


        let UPDATED =  {
          mutation: "UPDATED",
          data: newConversation,
        }

        pubsub.publish("CONVERSATION", {
          conversation: UPDATED
        });

        return UPDATED;
      }
      
      return;
    },

    // https://medium.com/geekculture/multiple-file-upload-with-apollo-server-3-react-graphql-da87880bc01d
    async fileUpload(parent, args, context, info){
      try{
        let start = Date.now()

        console.log("fileUpload :", args)

        let {file} = args

        let url = [];
        for (let i = 0; i < file.length; i++) {
          const { createReadStream, filename, encoding, mimetype } = await file[i];
          const stream = createReadStream();
          const assetUniqName = fileRenamer(filename);
          let pathName = `/app/uploads/${assetUniqName}`;

          const output = fs.createWriteStream(pathName)
          stream.pipe(output);

          await new Promise(function (resolve, reject) {
            output.on('close', () => {
              resolve();
            });
      
            output.on('error', (err) => {
              logger.error(err.toString());

              reject(err);
            });
          });

          const urlForArray = `${process.env.RA_HOST}${assetUniqName}`;
          url.push({ url: urlForArray });
        }

        console.log("url : ", url , `Time to execute = ${ (Date.now() - start) / 1000 } seconds`)

      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    
    async createPhone(parent, args, context, info){
      try{
        let start = Date.now()

        // let { currentUser } = context

        let { input } = args

        console.log("input :", input )

        // input = {...input, ownerId: currentUser._id}

        let data = await Phone.create(input);
        return {
          status: true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds` }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async updatePhone(parent, args, context, info){
      try{
        let start = Date.now()
        let { _id, input } = args

        let data = await Phone.findOneAndUpdate({ _id }, input, { new: true })

        return {
          status: true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
    async deletePhone(parent, args, context, info) {
      try{
        let { _id } = args
        console.log("deletePhone :", _id)

        let phone = await Phone.findByIdAndRemove({_id})

        // pubsub.publish('PHONE', {
        //   phone:{
        //       mutation: 'DELETED',
        //       data: phone
        //   }
        // });
        
        return phone;
      } catch(err) {
        logger.error(err.toString());
        return;
      }
    },
  },
  Subscription:{
    numberIncremented: {
      resolve: (payload) =>{
        console.log("payload :", payload)
        return 1234
      },
      subscribe: (parent, args, context, info) =>{
        console.log("parent, args, context, info > :", parent, args, context)
        return pubsub.asyncIterator(["NUMBER_INCREMENTED"])
      } ,

      /*
      // subscribe: withFilter((parent, args, context, info) => {
      //   console.log("parent, args, context, info :", parent, args, context)
      //   return context.pubsub.asyncIterator(["NUMBER_INCREMENTED"])
      // },
      // (payload, variables) => {
      //   console.log(">>>>>>>>>>>>>>>>>>> ", payload, variables)

      //   return payload.channelId === variables.channelId;
      // })
      */
    },
    // withFilter

    postCreated: {
      // More on pubsub below
      resolve: (payload) => 122,
      subscribe: (parent, args, context, info) =>{
        return pubsub.asyncIterator(['POST_CREATED'])
      } ,
    },
    subPost:{

      resolve: (payload) =>{
        // console.log("subPost : >>>>>>>>>>>>>>>>>>> payload : ", payload)
        return payload.post
      },
      subscribe: withFilter((parent, args, context, info) => {
          // console.log("subPost : parent, args, context, info :", parent, args, context)
          return pubsub.asyncIterator(["POST"])
        }, (payload, variables) => {
          let {mutation, data} = payload.post
          switch(mutation){
            case "CREATED":
            case "UPDATED":
            case "DELETED":
              {
                break;
              }
          }

          return _.findIndex(JSON.parse(variables.postIDs), (o) => _.isMatch(o, data.id) ) > -1;
        }
      )
    },
    subComment:{

      resolve: (payload) =>{
        return payload.comment
      },
      subscribe: withFilter((parent, args, context, info) => {
          // console.log("subComment : parent, args, context, info :", parent, args, context)
          return pubsub.asyncIterator(["COMMENT"])
        }, (payload, variables) => {
          let {mutation, commentID, data} = payload.comment
          switch(mutation){
            case "CREATED":
            case "UPDATED":
            case "DELETED":
              {
                break;
              }
          }

          return commentID == variables.commentID;
        }
      )
    },
    subBookmark: {
      resolve: (payload) =>{
        return payload.bookmark
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["BOOKMARK"])
        }, (payload, variables) => {
          let {mutation, data} = payload.bookmark
          // switch(mutation){
          //   case "CREATED":
          //   case "UPDATED":
          //   case "DELETED":
          //     {
          //       break;
          //     }
          // }
          return data.postId == variables.postId && data.userId == variables.userId;
        }
      )
    },
    subShare: {
      resolve: (payload) =>{
        return payload.share
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["SHARE"])
        }, (payload, variables) => {
          let {mutation, data} = payload.share

          // console.log("subShare: ", data, payload, variables)
          // switch(mutation){
          //   case "CREATED":
          //   case "UPDATED":
          //   case "DELETED":
          //     {
          //       break;
          //     }
          // }
          return data.postId == variables.postId;
        }
      )
    },
    subConversation: {
      resolve: (payload) =>{
        return payload.conversation
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["CONVERSATION"])
        }, (payload, variables, context) => {
          let {mutation, data} = payload.conversation
          
          // let {currentUser} = context
          // if(_.isEmpty(currentUser)){
          //   return false;
          // }

          // console.log("CONVERSATION: ", payload)
          switch(mutation){
            case "CREATED":
            case "UPDATED":
            case "DELETED":
              {
                return _.findIndex(data.members, (o) => o.userId == variables.userId ) > -1
              }

            case "CONNECTED":
            case "DISCONNECTED":{
              // console.log("CONVERSATION :::: ", mutation, data)
            }
          }

          return false;
          
        }
      )
    },
    subNotification: {
      resolve: (payload) =>{
        return payload.notification
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["NOTIFICATION"])
        }, (payload, variables, context) => {
          let {mutation, data} = payload.notification
          
          // let {currentUser} = context
          // if(_.isEmpty(currentUser)){
          //   return false;
          // }

          console.log("NOTIFICATION: ", payload, variables, data)
          // switch(mutation){
          //   case "CREATED":
          //   case "UPDATED":
          //   case "DELETED":
          //     {
          //       return _.findIndex(data.members, (o) => o.userId == variables.userId ) > -1
          //     }

          //   case "CONNECTED":
          //   case "DISCONNECTED":{
          //     // console.log("CONVERSATION :::: ", mutation, data)
          //   }
          // }

          return data.user_to_notify === variables.userId;
        }
      )
    },
    subMessage: {
      resolve: (payload) =>{
        return payload.message
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["MESSAGE"])
        }, async (payload, variables, context) => {
          let {mutation, data} = payload.message

          if(variables.conversationId === data.conversationId &&  variables.userId !== data.senderId) {
            
            let conversation = await Conversation.findById(variables.conversationId);

            // console.log("MESSAGE ::", variables, data)

            if(!_.isEmpty(conversation)){

              // update all message to read
              await Message.updateMany({
                  conversationId: variables.conversationId, 
                  senderId: { $nin: [ variables.userId ] },
                  status: 'sent',
                  reads: { $nin: [ variables.userId ] }
                }, 
                // {$set: {reads: [ userId ] }}
                { $push: {reads: variables.userId } }
              )

              // update conversation  unreadCnt = 0
              conversation = _.omit({...conversation._doc}, ["_id", "__v"])
          
              conversation = {...conversation, members: _.map(conversation.members, (member)=>member.userId == variables.userId ? {...member, unreadCnt:0} : member) }

              let newConversation = await Conversation.findOneAndUpdate({ _id : variables.conversationId }, conversation, { new: true })

              pubsub.publish("CONVERSATION", {
                conversation: {
                  mutation: "UPDATED",
                  data: newConversation,
                }
              });

              // return UPDATED;
            }
          }

          // let {currentUser} = context
          // if(_.isEmpty(currentUser)){
          //   return false;
          // }

          // switch(mutation){
          //   case "CREATED":
          //   case "UPDATED":
          //   case "DELETED":
          //     {
          //       break;
          //     }
          // }

          return data.conversationId === variables.conversationId && data.senderId !== variables.userId
        }
      )
    },
    // subUserTrack: {
    //   resolve: (payload) =>{
    //     return payload.user_track
    //   },
    //   subscribe: withFilter((parent, args, context, info) => {
    //       return pubsub.asyncIterator(["USER_TRACK"])
    //     }, async (payload, variables, context) => {
    //       let {mutation, data} = payload.user_track

    //       console.log("USER_TRACK :", mutation, data, variables)

    //       return false
    //     }
    //   )
    // }
  }

  // commentAdded
};