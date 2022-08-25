import { gql } from "apollo-server";

export default gql`
  scalar DATETIME
  scalar Long
  scalar Date
  scalar JSON

  scalar Upload

  type FileX {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  type Room {
    _id: ID
    name: String
    summary: String
    description: String
    roomType: String
    maximum_nights: Int
    minimum_nights: Int
    beds: Int
    accommodates: Int
    price: Float
    cleaningFee: Float
  }

  type User {
    _id: ID!
    username: String!
    password: String
    email: String
    displayName: String!
    isActive: String
    roles: [String]!
    bookmarks: [Bookmark]
    image: [File]
    lastAccess: DATETIME
  }

  type LoginWithSocial{
    _id: ID!
  }

  input UserInput {
    username: String!
    password: String!
    email: String!
    roles: [String]
    isActive: String!
    image: [FileInput]
  }

  input LoginInput {
    username: String!
    password: String!
    deviceAgent: String
  }

  input LoginWithSocialInput{
    idToken: String!
    name: String!
    email: String!
    typeSocial: String!
  }

  type RoomPayLoad {
    status:Boolean
    data:Room
  }
  
  type RoomsPayLoad {
    status:Boolean
    data:[Room]
  }

  type UserPayLoad {
    status:Boolean
    messages:String
    token:String
    executionTime:String
    data:User
  }

  type UsersPayLoad {
    status:Boolean
    executionTime:String
    data:[User]
    total: Int
  }

  type File {
    _id: ID!
    base64: String
    fileName: String
    lastModified: DATETIME
    size: Int
    type: String
  }

  type PostBank {
    _id: ID!
    bankAccountName: String
    bankId: String
  }

  type PostBankBank {
    _id: ID
    name: String!
    description: String
    isPublish: Int
  }
  
  type Post {
    _id: ID!
    title: String!
    nameSubname: String!
    idCard: Long
    amount: Int
    dateTranfer: DATETIME
    description: String!
    tels: [String]
    banks: [PostBank]
    follows: [ID]
    shares:[Share]
    files: [File]
    isPublish: Int
    ownerId: ID!
    createdAt : DATETIME
    updatedAt: DATETIME
  }

  type Role {
    _id: ID
    name: String
    description: String
    isPublish: Int
  }

  type Bank {
    _id: ID!
    name: String!
    description: String
  }

  type BasicContent {
    _id: ID!
    name: String!
    description: String
  }

  type TContactUs {
    _id: ID!
    name: String!
    description: String
  }

  type Share {
    _id: ID!
    userId: ID!
    postId: ID!
    destination: String
  }


  type Dblog {
    _id: ID!
    level: String
    meta: String
    message: String
    timestamp: String
  }

  type Conversation {
    _id: ID!
    userId: String
    name: String
    lastSenderName: String
    info: String
    avatarSrc: String
    avatarName: String
    status: String
    unreadCnt: Int
    sentTime: DATETIME
    members: [String]
  }

  type Message {
    _id: ID!
    conversationId: String!
    type: String!
    message: String
    sentTime: String
    sender: String!
    senderId: String!
    direction: String
    position: String!
    status: String!
  }

  type Mail {
    _id: ID!
    name: String!
    description: String
    isPublish: Int
  }

  type Socket {
    _id: ID!
    socketId: String!
    description: String
  }

  type Comment{
    status: Boolean
    executionTime: String
    data: [CommentParent]
  }

  type CommentData{
    _id: ID!
    postId: ID!
    data: [CommentParent]
  }

  type Bookmark{
    _id: ID
    userId: ID
    postId: ID
    status: Boolean
  }

  type Follow{
    _id: ID
    userId: ID
    friendId: ID
    status: Boolean
  }

  type Share{
    _id: ID!
    userId: ID!
    postId: ID!
    destination: String
  }

  type ContactUs {
    _id: ID!
    postId: String!
    categoryId: String!
    userId: String!
    description: String
  }

  type PostPayLoad {
    status:Boolean
    executionTime:String
    data:Post
  }
  
  type PostsPayLoad {
    status:Boolean
    executionTime:String
    data:[Post]
    total: Int
  }

  type RolePayLoad {
    status:Boolean
    executionTime:String
    data:Role
  }

  type RolesPayLoad {
    status:Boolean
    executionTime:String
    data:[Role]
  }

  type BankPayLoad {
    status:Boolean
    executionTime:String
    data:Bank
  }

  type BanksPayLoad {
    status:Boolean
    executionTime:String
    data:[Bank]
  }

  type BasicContentPayLoad {
    status:Boolean
    executionTime:String
    data:BasicContent
  }

  type BasicContentsPayLoad {
    status:Boolean
    executionTime:String
    data:[BasicContent]
  }

  type TContactUsPayLoad {
    status:Boolean
    executionTime:String
    data:TContactUs
  }

  type TContactUsListPayLoad {
    status:Boolean
    executionTime:String
    data:[TContactUs]
  }

  type MailPayLoad {
    status:Boolean
    executionTime:String
    data:Mail
  }

  type MailsPayLoad {
    status:Boolean
    executionTime:String
    data:[Mail]
  }

  type SocketPayLoad {
    status:Boolean
    executionTime:String
    data:Socket
  }

  type SocketsPayLoad {
    status:Boolean
    executionTime:String
    data:[Socket]
  }

  type CommentPayLoad{
    status:Boolean
    executionTime:String
    data:[CommentParent]
  }

  type CommentParent {
    userId: String
    comId: String
    fullName: String
    avatarUrl: String
    text: String
    replies: [Replies]
  }

  type Replies {
    userId: String
    comId: String
    fullName: String
    avatarUrl: String
    text: String
  }

  type CommentsPayLoad{
    status:Boolean
    executionTime:String
    data:[Comment]
    total: Int
  }

  type BookmarksPayLoad{
    status:Boolean
    executionTime:String
    data:[Bookmark]
  }

  type BookmarkPayLoad{
    status:Boolean
    executionTime:String
    data:Bookmark
  }

  type FollowPayLoad{
    status:Boolean
    executionTime:String
    data:Follow
  }

  type FollowsPayLoad{
    status:Boolean
    executionTime:String
    data:[Follow]
  }

  type SharesPayLoad{
    status:Boolean
    executionTime:String
    data:[Share]
  }

  type DblogPayLoad{
    status:Boolean
    executionTime:String
    data:[Dblog]
  }

  type ContactUsListPayLoad{
    status:Boolean
    executionTime:String
    data:[ContactUs]
  }

  type ConversationsPayLoad {
    status:Boolean
    executionTime:String
    data:[Conversation]
  }

  type MessagePayLoad {
    status:Boolean
    executionTime:String
    data:[Message]
  }

  type Query {
    homes( userId: ID, page: Long, perPage: Long, keywordSearch: String, category: String ): JSON

    user(_id: ID): UserPayLoad
    users(page: Int, perPage: Int): UsersPayLoad
    getManyUsers(_ids: [ID!]!): UsersPayLoad

    role(_id: ID!): RolePayLoad
    roles: RolesPayLoad
    getManyRoles(_ids: [ID!]!): RolesPayLoad

    bank(_id: ID!): BankPayLoad
    banks(page: Int, perPage: Int): BanksPayLoad
    getManyBanks(_ids: [ID!]!): BanksPayLoad

    Mail(_id: ID!): MailPayLoad
    Mails(page: Int, perPage: Int ): MailsPayLoad
    getManyMails(_ids: [ID!]!): MailsPayLoad

    socket(_id: ID!): SocketPayLoad
    sockets(page: Int, perPage: Int): SocketsPayLoad
    getManySockets(_ids: [ID!]!): SocketsPayLoad

    post( _id: ID! ): JSON
    posts( userId: ID, page: Int, perPage: Int ): JSON
    _allPostsMeta(page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): ListMetadata
    getManyPosts(_ids: [ID!]!): PostsPayLoad

    postsByUser(userId: ID!): PostsPayLoad
  
    
    comment(postId: ID!): CommentPayLoad
    getManyReferenceComment(postId: String, page: Int, perPage: Int, sortField: String, sortOrder: String, filter: PostFilter): CommentsPayLoad
  

    Bookmarks(page: Int, perPage: Int): BookmarksPayLoad
    bookmarksByPostId( postId: ID! ): BookmarksPayLoad
    isBookmark(userId: ID, postId: ID!): BookmarkPayLoad
    bookmarksByUserId( userId: ID! ): BookmarksPayLoad

    ContactUsList(page: Int, perPage: Int): ContactUsListPayLoad

    TContactUs(_id: ID!): TContactUsPayLoad
    TContactUsList(page: Int, perPage: Int): TContactUsListPayLoad
    getManyTContactUsList(_ids: [ID!]!): TContactUsListPayLoad


    Shares(page: Int, perPage: Int): SharesPayLoad
    shareByPostId(postId: ID!): SharesPayLoad


    Dblog(page: Int, perPage: Int): DblogPayLoad

    conversations(userId: ID): JSON
    notifications(userId: ID): JSON
    
    basicContent(_id: ID!): BasicContentPayLoad
    basicContents(page: Int, perPage: Int): BasicContentsPayLoad

    isFollow(userId: ID!, friendId: ID!): FollowPayLoad
    follower(userId: ID!): UsersPayLoad
    followingByUserId(userId: ID!): FollowsPayLoad


    fetchMessage(conversationId: ID): JSON

    phones(userId: ID, page: Int, perPage: Int): JSON
    phone(_id: ID!): JSON
  }  
  
  input RoomInput {
    name: String
    summary: String
    description: String
    room_type: String
    maximum_nights: Int
    minimum_nights: Int
    beds: Int
    accommodates: Int
    price: Float
    cleaningFee: Float
  }

  input PostInput {
    title: String!
    nameSubname: String!
    idCard: String
    amount: Long!
    dateTranfer: DATETIME
    description: String
    banks: [PostBankInput]
    tels: [String]
    files: [JSON]
    follows: [ID]
    isPublish: Int
    ownerId: ID!
  }

  input PostBankInput {
    bankAccountName: String
    bankId: String
  }

  input PhoneInput {
    phones: [String!]
    description: String
  }

  input RoleInput {
    name: String!
    description: String
    isPublish: Int
  }

  input BInput {
    id: ID
    name: String!
    description: String
    isPublish: Int
  }

  input MailInput {
    name: String!
    description: String
    isPublish: Int
  }

  input BankInput {
    name: String!
    description: String
  }

  input BasicContentInput {
    name: String!
    description: String
  }

  input ContactUsInput{
    postId: String!
    categoryId: String!
    userId: ID!
    description: String
  }

  input TContactUsInput {
    name: String!
    description: String
  }

  input ShareInput {
    userId: ID!
    postId: ID!
    destination: String
  }

  input ConversationInput{
    userId: ID!
    friendId: ID!
  }

  input UpdateConversationInput{
    muted: Boolean
    unread: Int
    title: String
    subtitle: String
    alt: String
    avatar: String
  }

  input MessageInput{
    _id: String!
    conversationId: String!
    type: String!
    message: String
    sentTime: DATETIME
    direction: String
    position: String!
    status: String!
    payload: [JSON]
    files: [Upload]
  }

  input FileInput {
    base64: String
    fileName: String
    lastModified: DATETIME
    size: Int
    type: String
  }

  input CommentInput {
    postId: ID!
    data: [CommentParentInput]
  }

  input CommentParentInput {
    userId: String
    comId: String
    fullName: String
    avatarUrl: String
    text: String
    notify: Boolean
    replies: [RepliesInput]
  }

  input RepliesInput {
    userId: String
    comId: String
    fullName: String
    avatarUrl: String
    text: String
    notify: Boolean
  }

  input BookmarkInput {
    postId: ID!
    userId: ID!
    status: Boolean
  }

  input FollowInput {
    userId: ID!
    friendId: ID!
    status: Boolean
  }

  type Mutation {
    login(input: LoginInput): UserPayLoad
    loginWithSocial(input: LoginWithSocialInput): LoginWithSocial

    createUser(input: UserInput): User
    updateUser(_id: ID!, input: UserInput): User
    deleteUser(_id: ID!): User

    createPost(input: JSON): JSON
    updatePost(_id: ID!, input: PostInput): Post
    deletePost(_id: ID!): Post
    deletePosts(_ids: [ID!]!): deleteType

    createRole(input: RoleInput): Role
    updateRole(_id: ID!, input: RoleInput): Role
    deleteRole(_id: ID!): Role
    deleteRoles(_ids: [ID!]!): deleteType

    createBank(input: BankInput): Bank
    updateBank(_id: ID!, input: BankInput): Bank
    deleteBank(_id: ID!): Bank
    deleteBanks(_ids: [ID!]!): deleteType

    createMail(input: MailInput): Mail
    updateMail(_id: ID!, input: MailInput): Mail
    deleteMail(_id: ID!): Mail
    deleteMails(_ids: [ID!]!): deleteType

    createAndUpdateComment(input: CommentInput): Comment
    updateComment(_id: ID!, input: CommentInput): Comment
    deleteComment(_id: ID!): Comment
    deleteComments(_ids: [ID!]!): deleteType

    createAndUpdateBookmark(input: BookmarkInput): Bookmark

    createContactUs(input: ContactUsInput): ContactUs

    createTContactUs(input: TContactUsInput): TContactUs
    updateTContactUs(_id: ID!, input: TContactUsInput): TContactUs
    deleteTContactUs(_id: ID!): TContactUs
    deleteTContactUsList(_ids: [ID!]!): deleteType

    createShare(input: ShareInput): Share

    createConversation(input: ConversationInput!): JSON
    updateConversation(_id: ID!, input: UpdateConversationInput): JSON
    
    addMessage( userId: ID!, conversationId: ID!, input: MessageInput ): JSON
    updateMessageRead( userId: ID!, conversationId: ID! ): JSON

    createBasicContent(input: BasicContentInput): BasicContent
    updateBasicContent(_id: ID!, input: BasicContentInput): BasicContent

    createAndUpdateFollow(input: FollowInput): Follow
    currentNumber: Int

    createPhone(input: PhoneInput): JSON
    updatePhone(_id: ID!, input: PhoneInput): JSON

    fileUpload(text: String!, file: [Upload]!): [FileX]!
  }

  type Subscription {
    numberIncremented(postIDs: String): Int
    postCreated: Int

    subPost(postIDs: String): PostSubscriptionPayload!
    subComment(commentID: String): CommentSubscriptionPayload!
    subBookmark(userId: ID!, postId: ID!): BookmarkSubscriptionPayload!
    subShare(postId: ID!): ShareSubscriptionPayload!

    subConversation(userId: ID): JSON
    subNotification(userId: ID): JSON
    subMessage(userId: ID!, conversationId: ID!): JSON
  }

  type PostSubscriptionPayload {
    mutation: String!
    data: Post!
  }

  type CommentSubscriptionPayload {
    mutation: String!
    commentID: String!
    data: [CommentParent]!
  }

  type BookmarkSubscriptionPayload {
    mutation: String!
    data: Bookmark!
  }

  type ShareSubscriptionPayload {
    mutation: String!
    data: Share!
  }

  type ConversationSubscriptionPayload{
    mutation: String!
    data: Conversation!
  }

  type MessageSubscriptionPayload{
    mutation: String!
    data: Message!
  }

  type deleteType {
    ok: Int
  }

  input PostFilter {
    q: String
  }

  type ListMetadata {
    count: Int!
  }
`;
