import { gql } from "@apollo/client";

export const gqlPing = gql`query ping{ ping }`;

export const gqlHomes = gql`
    query Homes($page: Long, $perPage: Long, $keywordSearch: String, $category: String) {
        homes( page: $page perPage: $perPage keywordSearch: $keywordSearch category: $category )
    }`;

export const gqlPosts = gql`query Posts( $page: Int, $perPage: Int ) { posts( page: $page perPage: $perPage ) }`;

export const gqlPost = gql`query Post($id: ID!) { post(_id: $id) }`;

export const gqlPostsByUser =  gql`query PostsByUser($userId: ID!) { postsByUser( userId: $userId ) }`;

export const gqlUsers = gql`query users($page: Int, $perPage: Int){ users( page: $page perPage: $perPage ) }`;

export const gqlUser = gql`query User($id: ID){ user(_id: $id) }`;

export const gqlProfile = gql`query Profile{ profile }`;

export const gqlRoles = gql`
    query roles{
        roles{
            status
            executionTime
            data{
                id: _id
                name
                description
                isPublish
            }
        }
    }`;

export const gqlRole = gql`
    query role($id: ID!){
        role(_id: $id){
            status
            executionTime
            data{
                id: _id
                name
                description
            }
        }
    }`;

export const gqlManyRoles = gql`
    query GetManyRoles($ids: [ID!]!){
        getManyRoles(_ids: $ids)
        {
            status
            executionTime
            data{
                id: _id
                name
                description
                isPublish
            }
        }
    }`;
 
export const gqlBanks = gql`query banks{ banks }`;

export const gqlBank = gql`query bank($id: ID!){ bank(_id: $id) }`;

export const gqlTReportList = gql`
    query TReportList($page: Int, $perPage: Int){
        TReportList(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                name
                description
            }
        }
    }`;

export const gqlTReport = gql`
    query TReport($id: ID!){
        TReport(_id: $id){
            status
            executionTime
            data{
                id: _id
                name
                description
            }
        }
    }`;

export const gqlSockets = gql`
    query sockets($page: Int, $perPage: Int){
        sockets(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                socketId
                # description
            }
        }
    }`;

export const gqlThemeMails = gql`
    query Mails($page: Int, $perPage: Int){
        Mails(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                name
                description
                isPublish
            }
        }
    }`;

export const gqlReports = gql`
    query Reports($page: Int, $perPage: Int){
        Reports(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                userId
                description
            }
        }
    }`;

export const gqlBookmarks = gql`query Bookmarks($page: Int, $perPage: Int){ bookmarks( page: $page perPage: $perPage ) }`;

export const gqlBookmarksByPostId = gql`
    query BookmarksByPostId($postId: ID!){
        bookmarksByPostId(
            postId: $postId
        ){
            status
            executionTime
            data {
                id: _id
                userId
                postId
                status
            }
        }
    }`;

export const gqlBookmarksByUserId = gql`
    query BookmarksByUserId($userId: ID!){
        bookmarksByUserId(
            userId: $userId
        ){
            status
            executionTime
            data {
                id: _id
                userId
                postId
                status
            }
        }
    }`;

export const gqlIsBookmark = gql`
    query IsBookmark($postId: ID!){
        isBookmark(
            postId: $postId
        ){
            status
            executionTime
            data{
                id: _id
                userId
                postId
                status
            }
        }
    }`;

export const gqlReport = gql`
    query ReportList($page: Int, $perPage: Int){
        ReportList(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                userId
                postId
                categoryId
                description
            }
        }
    }`;

export const gqlComment = gql`query Comment($postId: ID!) { comment( postId: $postId ) }`;

export const gqlShares = gql`query Shares($page: Int, $perPage: Int){ shares( page: $page perPage: $perPage ) }`;

export const gqlShareByPostId = gql`
    query ShareByPostId($postId: ID!){
        shareByPostId(
            postId: $postId
        ){
            status
            executionTime
            data{
                id: _id
                userId
                postId
                destination
            }
        }
    }`;

export const gqlDblog = gql`
    query Dblog($page: Int, $perPage: Int){
        Dblog(
            page: $page
            perPage: $perPage
        ){
            status
            executionTime
            data{
                id: _id
                level
                message
                timestamp
            }
        }
    }`;

export const gqlConversations = gql`query conversations{ conversations }`;

export const gqlNotifications = gql`query notifications{ notifications }`;

export const gqlBasicContent =  gql`query BasicContent($id: ID!){ basicContent(_id: $id) }`;

export const gqlBasicContents  = gql`query BasicContents($page: Int, $perPage: Int){ basicContents( page: $page perPage: $perPage ) }`;
    
export const gqlIsFollow = gql`
    query IsFollow($userId: ID!, $friendId: ID!){
        isFollow(
            userId: $userId
            friendId: $friendId
        ){
            status
            executionTime
            data{
                _id
                status
            }
        }
    }`;

export const gqlFollower = gql`
    query Follower($userId: ID!){
        follower(
            userId: $userId
        ){
            status
            executionTime
            total
            data {
                _id
                username
                password
                email
                displayName
                isActive
                roles
                bookmarks {
                  _id
                  userId
                  postId
                  status
                }
                image {
                  _id
                  base64
                  fileName
                  lastModified
                  size
                  type
                }
                lastAccess
            }
        }
    }`;

export const gqlFollowingByUserId = gql`
    query FollowingByUserId($userId: ID!){
        followingByUserId(
            userId: $userId
        ){
            status
            executionTime
            data{
                id: _id
                userId
                friendId
                status
            }
        }
    }`;

export const gqlFetchMessage = gql`query fetchMessage( $conversationId: ID ){ fetchMessage( conversationId: $conversationId ) }`;
export const gqlPhones = gql`query phones( $page: Int, $perPage: Int) { phones( page: $page, perPage: $perPage ) }`;
export const gqlPhone = gql`query phone($id: ID!){ phone(_id: $id) }`;

//////////////////  mutation  ///////////////////

export const gqlLogin = gql`mutation Login($input: LoginInput) { login(input: $input) }`;

export const gqlLoginWithSocial = gql`mutation LoginWithSocial($input: LoginWithSocialInput) { loginWithSocial(input: $input) }`;

export const gqlCreateUser = gql`
    mutation CreateUser($input: UserInput) {
        createUser(input: $input) { id: _id }
    }`;

export const gqlCreatePost = gql`mutation CreatePost($input: JSON) { createPost(input: $input) }`;

export const gqlCreateAndUpdateBookmark = gql`mutation CreateAndUpdateBookmark($input: BookmarkInput) { createAndUpdateBookmark(input: $input) }`;

export const gqlCreateRole = gql`
    mutation CreateRole($input: RoleInput) {
        createRole(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateBank = gql`
    mutation CreateBank($input: BankInput) {
        createBank(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateBasicContent = gql`
    mutation CreateBasicContent($input: BasicContentInput) {
        createBasicContent(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateReport = gql`
    mutation CreateReport($input: ReportInput) {
        createReport(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateTReport = gql`
    mutation CreateTReport($input: TReportInput) {
        createTReport(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateAndUpdateComment = gql`mutation CreateAndUpdateComment($input: JSON) { createAndUpdateComment(input: $input) }`;

export const gqlCreateShare = gql`
    mutation CreateShare($input: ShareInput) {
        createShare(input: $input) {
            id: _id
        }
    }`;

export const gqlCreateConversation = gql`mutation CreateConversation($input: ConversationInput!) { createConversation(input: $input) }`;

export const gqlCreateAndUpdateFollow = gql`
    mutation CreateAndUpdateFollow($input: FollowInput) {
        createAndUpdateFollow(input: $input) {
            _id
            status
        }
    }`;

export const gqlCreatePhone = gql`mutation CreatePhone($input: PhoneInput) { createPhone(input: $input) }`;
export const gqlUpdatePhone = gql`mutation updatePhone($id: ID!, $input: PhoneInput) { updatePhone(_id: $id, input: $input) }`;
   
export const gqlAddMessage = gql`
    mutation AddMessage( $conversationId: ID! , $input: MessageInput ) {
        addMessage( conversationId: $conversationId, input: $input )
    }`;

export const gqlUpdateUser = gql`mutation UpdateUser($id: ID!, $input: JSON) { updateUser(input: $input) }`;

export const gqlUpdatePost = gql`mutation UpdatePost($id: ID!, $input: JSON) { updatePost(_id: $id, input: $input) }`;
 
export const gqlUpdateRole = gql`
    mutation UpdateRole($id: ID!, $input: RoleInput) {
        updateRole(_id: $id, input: $input) {
            id: _id
        }
    }`;

export const gqlUpdateBank = gql`mutation UpdateBank($id: ID!, $input: BankInput){ updateBank(_id: $id, input: $input) }`;

export const gqlUpdateBasicContent = gql`mutation UpdateBasicContent($id: ID!, $input: BasicContentInput) { updateBasicContent(_id: $id, input: $input) }`;

export const gqlUpdateTReport = gql`
    mutation UpdateTReport($id: ID!, $input: TReportInput) {
        updateTReport(_id: $id, input: $input) {
            id: _id
        }
    }`;

export const gqlCurrentNumber = gql`
    mutation Query {
        currentNumber
      }`;

export const gqlUpdateMessageRead = gql`
        mutation UpdateMessageRead($conversationId: ID!) {
            updateMessageRead( conversationId: $conversationId)
        }`;
  
export const gqlFileUpload = gql`
        mutation fileUpload($text: String!, $file: [Upload]!) {
            fileUpload(text: $text, file: $file) {
                filename
                mimetype
                encoding
            }
        }`

export const gqlDeletePost = gql`mutation DeletePost($id: ID!) { deletePost(_id: $id) }`;
 
export const gqlDeletePhone = gql`mutation DeletePhone($id: ID!) { deletePhone(_id: $id) }`;

export const gqlDeleteBank  = gql`mutation DeleteBank($id: ID!) { deleteBank(_id: $id) }`;

export const gqlDeleteUser  = gql`mutation DeleteUser($id: ID!) { deleteUser(_id: $id) }`;

export const gqlDeleteBasicContent = gql`mutation DeleteBasicContent($id: ID!) { deleteBasicContent(_id: $id) }`;

//////////////////  mutation  ///////////////////


//////////////////  subscription  ///////////////////

export const subNumberIncremented = gql`
  subscription OnnumberIncremented($postIDs: String) {
    numberIncremented(postIDs: $postIDs)
  }
`;

export const subPostCreated = gql`
    subscription Subscription {
    postCreated
  }
`;

// subPost
export const subPost = gql`subscription subPost($postIDs: String) { subPost(postIDs: $postIDs) }`;

export const subComment = gql`subscription subComment($commentID: String) { subComment(commentID: $commentID) } `;

export const subBookmark = gql`subscription subBookmark( $postId: ID! ){ subBookmark(postId: $postId) }`;

export const subShare = gql`subscription subShare( $postId: ID! ) { subShare( postId: $postId ) }`;

export const subConversation = gql`subscription subConversation($userId: ID) { subConversation( userId: $userId ) }`;

export const subNotification = gql`subscription subNotification($userId: ID) { subNotification( userId: $userId ) }`;

export const subMessage = gql`subscription subMessage($userId: ID!, $conversationId: ID!) { subMessage( userId: $userId, conversationId: $conversationId)  }`;

//////////////////  subscription  ///////////////////