import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useRouteMatch } from "react-router-dom";
import MuiLink from "@material-ui/core/Link";
import HomeIcon from '@mui/icons-material/Home';

import { useTranslation } from "react-i18next";

const Breadcs = ({ title }) => {

  const { t } = useTranslation();

  const homeMatches = useRouteMatch("/");
  const postsMatches = useRouteMatch("/posts");
  const newPostMatches = useRouteMatch("/post/new");
  const postMatches = useRouteMatch("/post/:jobid/edit");
  const commentsMatches = useRouteMatch("/comments");
  const newCommentMatches = useRouteMatch("/comment/new");
  const commentMatches = useRouteMatch("/comment/:jobid/edit");
  const usersMatches = useRouteMatch("/users");
  const newUserMatches = useRouteMatch("/user/new");
  const userMatches = useRouteMatch("/user/:uid/:mode");
  const socketsMatches = useRouteMatch("/sockets");
  const newSocketMatches = useRouteMatch("/newSocket");
  const socketMatches = useRouteMatch("/socket/:jobid");
  const rolesMatches = useRouteMatch("/roles");
  const newRoleMatches = useRouteMatch("/role/new");
  const roleMatches = useRouteMatch("/role/:jobid/edit");
  const banksMatches = useRouteMatch("/banks");
  const newBankMatches = useRouteMatch("/bank/new");
  const bankMatches = useRouteMatch("/bank/:jobid/edit");
  const themeMailsMatches = useRouteMatch("/theme-mails");
  const newThemeMailMatches = useRouteMatch("/theme-mail/new");
  const themeMailMatches = useRouteMatch("/theme-mail/:jobid/edit");
  const develMatches = useRouteMatch("/devel");
  const notificationMatches =useRouteMatch("/notification")
  const messengerMatches =useRouteMatch("/message")
  const bookmarksMatches =useRouteMatch("/bookmarks")
  // const reportsMatches =useRouteMatch("/reports")
  const sharesMatches =useRouteMatch("/shares")
  const reportMatches =useRouteMatch("/report")
  const treportListMatches =useRouteMatch("/treport-list")
  const dblogMatches =useRouteMatch("/dblog")
  const detailMatches =useRouteMatch("/detail")
  const helpMatches =useRouteMatch("/help")
  const basicContentsMatches = useRouteMatch("/basic-contents");
  const newBasicContentMatches = useRouteMatch("/basic-content/new");
  const basicContentMatches = useRouteMatch("/basic-content/:id/edit");
  const profileMatches = useRouteMatch("/me")

  const newPhoneMatches = useRouteMatch("/phone/new");
  const phoneMatches = useRouteMatch("/phone/:jobid/edit");
  const phonesMatches = useRouteMatch("/phones");

  // const privacyMatche = useRouteMatch("/privacy");
  const developerMatche = useRouteMatch("/developer");
  // const termsMatche = useRouteMatch("/terms");

  const privacyAndtermsMatche = useRouteMatch("/privacy+terms");

  const newContactUsMatches = useRouteMatch("/contact-us/new");
  const contactUsMatches = useRouteMatch("/contact-us/:id/edit");
  const contactUsListMatches = useRouteMatch("/contact-us-list");

  const newTopicMatches = useRouteMatch("/topic/new");
  const topicMatches = useRouteMatch("/topic/:id/edit");
  const topicsMatches = useRouteMatch("/topics");

  const loginMatche = useRouteMatch("/user/login");
  const pdpaMatche = useRouteMatch("/pdpa");

  const handleClick = () => {};
  return (
    <div role="presentation" onClick={handleClick} className="container-breadcrumb">
      <div className="row">
        <Breadcrumbs aria-label="breadcrumb" >
          {homeMatches && (
            <MuiLink component={Link} to="/">
            <HomeIcon /> {t("home")} 
            </MuiLink>
          )}
          {postsMatches && (
            <MuiLink component={Link} to="/posts">
              {t("posts")} 
            </MuiLink>
          )}
          {newPostMatches && (
            <MuiLink component={Link} to="/post/new">
              {t("new_post")}
            </MuiLink>
          )}
          {postMatches && (
            <MuiLink
              component={Link}
              to={`/post/${postMatches.params.jobid}/edit`}
            >
              {t("edit_post")}
            </MuiLink>
          )}
          {commentsMatches && (
            <MuiLink component={Link} to="/comments">
              Comments
            </MuiLink>
          )}
          {newCommentMatches && (
            <MuiLink component={Link} to="/comment/new">
              New comment
            </MuiLink>
          )}
          {commentMatches && (
            <MuiLink
              component={Link}
              to={`/comment/${commentMatches.params.jobid}/edit`}
            >Edit comment</MuiLink>
          )}
          {usersMatches && (
            <MuiLink component={Link} to="/users">{t("users")}</MuiLink>
          )}
          {newUserMatches && (
            <MuiLink component={Link} to="/user/new">{t("new_user")}</MuiLink>
          )}
          {userMatches && (
            <MuiLink
              component={Link}
              to={`/user/${userMatches.params.uid}/${userMatches.params.mode}`}
            >{ userMatches.params.mode == "view" ? t("view_profile") : t("edit_profile")}</MuiLink>
          )}
          {socketsMatches && (
            <MuiLink component={Link} to="/sockets">
              Sockets
            </MuiLink>
          )}
          {newSocketMatches && (
            <MuiLink component={Link} to="/newSocket">
              New socket
            </MuiLink>
          )}
          {socketMatches && (
            <MuiLink
              component={Link}
              to={`/socket/${socketMatches.params.jobid}`}
            >
              Socket ({socketMatches.params.jobid})
            </MuiLink>
          )}
          {rolesMatches && (
            <MuiLink component={Link} to="/roles">Roles</MuiLink>
          )}
          {newRoleMatches && (
            <MuiLink component={Link} to="/role/new">New role</MuiLink>
          )}
          {roleMatches && (
            <MuiLink component={Link} to={`/role/${roleMatches.params.jobid}`}>
              Edit role {/* ({roleMatches.params.jobid}) */}
            </MuiLink>
          )}
          {banksMatches && (
            <MuiLink component={Link} to="/banks">
              Banks
            </MuiLink>
          )}
          {newBankMatches && (
            <MuiLink component={Link} to="/bank/new">
              New bank
            </MuiLink>
          )}
          {bankMatches && (
            <MuiLink
              component={Link}
              to={`/bank/${bankMatches.params.jobid}/edit`}
            >
              Edit bank {/*({bankMatches.params.jobid}) */}
            </MuiLink>
          )}
          {themeMailsMatches && (
            <MuiLink component={Link} to="/theme-mails">
              Theme mails
            </MuiLink>
          )}
          {newThemeMailMatches && (
            <MuiLink component={Link} to="/theme-mail/new">
              New Theme mail
            </MuiLink>
          )}
          {themeMailMatches && (
            <MuiLink
              component={Link}
              to={`/theme-mail/${themeMailMatches.params.jobid}/edit`}
            >
              Edit Theme mail {/*({bankMatches.params.jobid}) */}
            </MuiLink>
          )}
          {develMatches && (
            <MuiLink component={Link} to="/devel">
              Devel
            </MuiLink>
          )}
          {notificationMatches && (
            <MuiLink component={Link} to="/notification">
              {t("notification")}
            </MuiLink>
          )}
          {messengerMatches && (
            <MuiLink component={Link} to="/message">
              Message
            </MuiLink>
          )}
          {bookmarksMatches && (
            <MuiLink component={Link} to="/bookmarks">
              {t("bookmarks")}
            </MuiLink>
          )}
          {/* {reportsMatches && (
            <MuiLink component={Link} to="/reports">
              Reports
            </MuiLink>
          )} */}
          {sharesMatches && (
            <MuiLink component={Link} to="/shares">
              Shares
            </MuiLink>
          )}
          {reportMatches && (
            <MuiLink component={Link} to="/report">
              {t("reports")}
            </MuiLink>
          )}
          {treportListMatches && (
            <MuiLink component={Link} to="/treport-list">
              Taxonomy Report
            </MuiLink>
          )}
          {dblogMatches && (
            <MuiLink component={Link} to="/dblog">
              Log messages 
            </MuiLink>
          )}
          {detailMatches && (
            <MuiLink component={Link} to="/detail">
              Detail 
            </MuiLink>
          )}
          {helpMatches && (
            <MuiLink component={Link} to="/help">
              {t("help")} 
            </MuiLink>
          )}

          {basicContentsMatches && (
            <MuiLink 
              component={Link} 
              to="/basic-contents">
              Basic contents
            </MuiLink>
          )}
          {newBasicContentMatches && (
            <MuiLink 
              component={Link} 
              to="/basic-content/new">
              New Basis content
            </MuiLink>
          )}
          {basicContentMatches && (
            <MuiLink
              component={Link}
              to={`/basic-content/${basicContentMatches.params.id}/edit`}
            >
              Edit Basis content {/*({bankMatches.params.jobid}) */}
            </MuiLink>
          )}

          {profileMatches && (
            <MuiLink
              component={Link}
              to={`/me`}
            >
              {t("profile")}
            </MuiLink>
          )}

          {newPhoneMatches && (
            <MuiLink 
              component={Link} 
              to="/phone/new">
              {t("new_phone")}
            </MuiLink>
          )}
          {phoneMatches && (
            <MuiLink
              component={Link}
              to={`/phone/${phoneMatches.params.id}/edit`}
            >
              Edit phone
            </MuiLink>
          )}

          {phonesMatches && (
            <MuiLink component={Link} to="/phones">
              {t("phones")}
            </MuiLink>
          )}

          {newContactUsMatches && (
            <MuiLink 
              component={Link} 
              to="/contact-us/new">
              Contact us
            </MuiLink>
          )}
          {contactUsMatches && (
            <MuiLink
              component={Link}
              to={`/contact-us/${contactUsMatches.params.id}/edit`}
            >
              Edit Contact us
            </MuiLink>
          )}

          {contactUsListMatches && (
            <MuiLink component={Link} to="/contact-us-list">
              Contact us list
            </MuiLink>
          )}
          {newTopicMatches && (
            <MuiLink 
              component={Link} 
              to="/topic/new">
              Topic
            </MuiLink>
          )}
          {topicMatches && (
            <MuiLink
              component={Link}
              to={`/topic/${topicMatches.params.id}/edit`}
            >
              Edit Topic
            </MuiLink>
          )}

          {topicsMatches && (
            <MuiLink component={Link} to="/topics">
              Topics
            </MuiLink>
          )}

          {developerMatche && (
              <MuiLink component={Link} to="/developer">
                {t("developer")}
              </MuiLink>
            )}

          {privacyAndtermsMatche && (
            <MuiLink component={Link} to="/privacy+terms">
              {t("privacy_and_terms")}
            </MuiLink>
          )}

          {/*  */}
          {pdpaMatche && (
            <MuiLink component={Link} to="/pdpa">
              {t("pdpa")}
            </MuiLink>
          )}
        </Breadcrumbs>
      </div>
    </div>
  );
};

export default Breadcs;
