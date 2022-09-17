import {
  LineStyle,
  Timeline,
  TrendingUp,
  Group,
  Info,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline
} from "@material-ui/icons";
import CommentIcon from "@mui/icons-material/Comment";
import PowerIcon from "@mui/icons-material/Power";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import WebhookIcon from "@mui/icons-material/Webhook";
import RuleIcon from "@mui/icons-material/Rule";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@material-ui/icons/Mail";
import AdbIcon from '@mui/icons-material/Adb';
import HelpIcon from '@mui/icons-material/Help';

import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

import BookmarksIcon from '@mui/icons-material/Bookmarks';
import BugReportIcon from '@mui/icons-material/BugReport';

import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

const MenuAdministrator = [
  {
    Id: 1,
    Name: "Home",
    Icon: <HomeIcon className="icon" />,
    Path: "/"
  },
  {
    Id: 2,
    Name: "Posts",
    Icon: <Timeline className="icon" />,
    Path: "/posts"
  },
  {
    Id: 3,
    Name: "Phones",
    Icon: <LocalPhoneIcon className="icon" />,
    Path: "/phones"
  },
  {
    Id: 4,
    Name: "Bookmarks",
    Icon: <BookmarksIcon className="icon" />,
    Path: "/bookmarks"
  },
  {
    Id: 5,
    Name: "Users",
    Icon: <Group className="icon" />,
    Path: "/users"
  },
  {
    Id: 6,
    Name: "Taxonomy",
    Icon: <AssistantPhotoIcon className="icon" />,
    // Path: "/devel",
    Sheets: [
      {
        Id: 12,
        Title: "Devel",
        // Icon: <WebhookIcon className="icon" />,
        Path: "/devel"
      },
      {
        Id: 13,
        Title: "Roles",
        // Icon: <RuleIcon className="icon" />,
        Path: "/roles"
      },
      {
        Id: 14,
        Title: "Banks",
        // Icon: <AccountBalanceWalletIcon className="icon" />,
        Path: "/banks"
      },
      {
        Id: 15,
        Title: "Theme mail",
        // Icon: <MailIcon className="icon" />,
        Path: "/theme-mails"
      },
      {
        Id: 16,
        Title: "ContactUs",
        // Icon: <MailIcon className="icon" />,
        Path: "/tcontactus-list"
      },
      {
        Id: 17,
        Title: "Shares",
        // Icon: <MailIcon className="icon" />,
        Path: "/shares"
      },
      {
        Id: 18,
        Title: "Basic contents",
        Path : "/basic-contents"
      }
    ]
  },
  {
    Id: 7,
    Name: "Contact Us",
    Icon: <BugReportIcon className="icon" />,
    Path: "/contact-us"
  },
  {
    Id: 8,
    Name: "Recent log messages",
    Icon: <AdbIcon className="icon" />,
    Path: "/dblog"
  },
  {
    Id: 9,
    Name: "Terms",
    Icon: <GavelIcon className="icon" />,
    Path: "/terms"
  },
  {
    Id: 10,
    Name: "Privacy",
    Icon: <SecurityIcon className="icon" />,
    Path: "/privacy"
  },
  {
    Id: 11,
    Name: "Developer",
    Icon: <DeveloperModeIcon className="icon" />,
    Path: "/developer"
  },
  {
    Id: 12,
    Name: "Help",
    Icon: <HelpIcon className="icon" />,
    Path: "/help"
  }
];

const MenuAuthenticated = [
  {
    Id: 1,
    Name: "Home",
    Icon: <HomeIcon className="icon" />,
    Path: "/"
  },
  {
    Id: 2,
    Name: "Posts",
    Icon: <Timeline className="icon" />,
    Path: "/posts"
  },
  {
    Id: 3,
    Name: "Phones",
    Icon: <LocalPhoneIcon className="icon" />,
    Path: "/phones"
  },
  {
    Id: 4,
    Name: "Terms",
    Icon: <GavelIcon className="icon" />,
    Path: "/terms"
  },
  {
    Id: 5,
    Name: "Privacy",
    Icon: <SecurityIcon className="icon" />,
    Path: "/privacy"
  },
  {
    Id: 11,
    Name: "Developer",
    Icon: <DeveloperModeIcon className="icon" />,
    Path: "/developer"
  },
  {
    Id: 6,
    Name: "Help",
    Icon: <HelpIcon className="icon" />,
    Path: "/help"
  }
];

const MenuAnonymous = [
  {
    Id: 1,
    Name: "Home",
    Icon: <HomeIcon className="icon" />,
    Path: "/"
  },
  {
    Id: 2,
    Name: "Terms",
    Icon: <GavelIcon className="icon" />,
    Path: "/terms"
  },
  {
    Id: 3,
    Name: "Privacy",
    Icon: <SecurityIcon className="icon" />,
    Path: "/privacy"
  },
  {
    Id: 4,
    Name: "Help",
    Icon: <HelpIcon className="icon" />,
    Path: "/help"
  }
];

export {
  MenuAdministrator,
  MenuAuthenticated,
  MenuAnonymous
} ;
