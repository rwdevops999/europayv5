import { absoluteUrl } from "@/lib/functions";
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";
import { GiScrollUnfurled } from "react-icons/gi";
import { GrTest } from "react-icons/gr";
import { IoIosKey } from "react-icons/io";
import { LuClipboardList, LuLayoutDashboard } from "react-icons/lu";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { TbTestPipe } from "react-icons/tb";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  disabled: boolean;
  visible: boolean;
  icon?: React.ReactNode;
  subItems?: MenuItem[];
  parent?: string;
}

export let menu: MenuItem[] = [
  {
    url: absoluteUrl("/dashboard"),
    title: "Dashboard",
    disabled: false,
    visible: true,
    subItems: [],
    icon: <LuLayoutDashboard size={16} />,
  },
  // {
  //   url: "#",
  //   title: "Overviews",
  //   disabled: false,
  //   visible: true,
  //   icon: <GrOverview size={16} />,
  //   subItems: [
  //     {
  //       title: "Tasks",
  //       url: absoluteUrl("/tasks"),
  //       disabled: false,
  //       visible: true,
  //       icon: <FaTasks size={16} />,
  //       subItems: [],
  //       parent: "Overviews",
  //     },
  //     {
  //       title: "Jobs",
  //       url: absoluteUrl("/jobs"),
  //       disabled: false,
  //       visible: true,
  //       icon: <GrTasks size={16} />,
  //       subItems: [],
  //     },
  //     {
  //       url: absoluteUrl("/transactions"),
  //       title: "Transactions",
  //       disabled: false,
  //       visible: true,
  //       icon: <GrTransaction size={16} />,
  //       subItems: [],
  //     },
  //     {
  //       url: absoluteUrl("/history"),
  //       title: "History",
  //       disabled: false,
  //       visible: true,
  //       icon: <LuHistory size={16} />,
  //       subItems: [],
  //     },
  //     {
  //       url: absoluteUrl("/exports"),
  //       title: "Exports",
  //       disabled: false,
  //       visible: true,
  //       icon: <PiExportFill size={16} />,
  //       subItems: [],
  //     },
  //   ],
  // },
  // {
  //   url: "#",
  //   title: "Settings",
  //   disabled: false,
  //   visible: true,
  //   icon: <GiSettingsKnobs size={16} />,
  //   subItems: [
  //     {
  //       title: "General",
  //       url: absoluteUrl("/settings/general"),
  //       disabled: false,
  //       visible: true,
  //       icon: <MdSettingsAccessibility size={16} />,
  //       subItems: [],
  //       parent: "Settings",
  //     },
  //     {
  //       title: "Storage",
  //       url: absoluteUrl("/settings/storage"),
  //       disabled: false,
  //       visible: true,
  //       icon: <GrStorage size={16} />,
  //       subItems: [],
  //       parent: "Settings",
  //     },
  //     {
  //       title: "Limits",
  //       url: absoluteUrl("/settings/limits"),
  //       disabled: false,
  //       visible: true,
  //       icon: <PiSpeedometerDuotone size={16} />,
  //       subItems: [],
  //       parent: "Settings",
  //     },
  //     {
  //       title: "Export",
  //       url: absoluteUrl("/settings/export"),
  //       disabled: false,
  //       visible: true,
  //       icon: <TbDatabaseExport size={16} />,
  //       subItems: [],
  //       parent: "Settings",
  //     },
  //     {
  //       title: "Import",
  //       url: absoluteUrl("/settings/import"),
  //       disabled: false,
  //       visible: true,
  //       icon: <TbDatabaseImport size={16} />,
  //       subItems: [],
  //       parent: "Settings",
  //     },
  //   ],
  // },
  // {
  //   title: "Admin",
  //   url: absoluteUrl("/admin"),
  //   disabled: false,
  //   visible: true,
  //   subItems: [],
  //   icon: <RiAdminFill size={16} />,
  // },
  // {
  //   title: "User",
  //   url: absoluteUrl("/user"),
  //   disabled: false,
  //   visible: true,
  //   subItems: [],
  //   icon: <FaUsersCog size={16} />,
  // },
  {
    url: "#",
    title: "IAM",
    disabled: false,
    visible: true,
    icon: <IoIosKey size={16} />,
    subItems: [
      {
        title: "Services",
        url: absoluteUrl("/iam/services/id"),
        disabled: false,
        visible: true,
        icon: <FcServices size={16} />,
        subItems: [],
        parent: "IAM",
      },
      {
        title: "Statements",
        url: absoluteUrl("/iam/statements/id"),
        disabled: false,
        visible: true,
        icon: <LuClipboardList size={16} />,
        subItems: [],
        parent: "IAM",
      },
      {
        title: "Policies",
        url: absoluteUrl("/iam/policies/id"),
        disabled: false,
        visible: true,
        icon: <RiPoliceBadgeLine size={16} />,
        subItems: [],
        parent: "IAM",
      },
      {
        title: "Roles",
        url: absoluteUrl("/iam/roles/id"),
        disabled: false,
        visible: true,
        icon: <GiScrollUnfurled size={16} />,
        subItems: [],
        parent: "IAM",
      },
      {
        title: "Users",
        url: absoluteUrl("/iam/users/id"),
        disabled: false,
        visible: true,
        icon: <FaUser size={16} />,
        subItems: [],
        parent: "IAM",
      },
      {
        title: "Groups",
        url: absoluteUrl("/iam/groups/id"),
        disabled: false,
        visible: true,
        icon: <FaUserGroup size={16} />,
        subItems: [],
        parent: "IAM",
      },
    ],
  },
  // {
  //   url: absoluteUrl("/manual"),
  //   title: "Manual",
  //   disabled: false,
  //   visible: true,
  //   icon: <GiBookCover size={16} />,
  //   subItems: [],
  // },
  {
    url: "#",
    title: "Tests",
    disabled: false,
    visible: process.env.NODE_ENV !== "production",
    icon: <GrTest size={16} />,
    subItems: [
      {
        title: "TestPage1",
        url: absoluteUrl("/tests/testpage1"),
        disabled: false,
        visible: true,
        icon: <TbTestPipe size={16} />,
        subItems: [],
        parent: "Tests",
      },
      // {
      //   title: "TestUI",
      //   url: absoluteUrl("/tests/testui"),
      //   disabled: false,
      //   visible: true,
      //   icon: <TbTestPipe size={16} />,
      //   subItems: [],
      //   parent: "Tests",
      // },
      // {
      //   title: "TestComponents",
      //   url: absoluteUrl("/tests/testcomponents"),
      //   disabled: false,
      //   visible: true,
      //   icon: <TbTestPipe size={16} />,
      //   subItems: [],
      //   parent: "Tests",
      // },
      // {
      //   title: "TestCharts",
      //   url: absoluteUrl("/tests/testcharts"),
      //   disabled: false,
      //   visible: true,
      //   icon: <TbTestPipe size={16} />,
      //   subItems: [],
      //   parent: "Tests",
      // },
      // {
      //   title: "TestMail",
      //   url: absoluteUrl("/tests/testmail"),
      //   disabled: false,
      //   visible: true,
      //   icon: <TbTestPipe size={16} />,
      //   subItems: [],
      //   parent: "Tests",
      // },
    ],
  },
];
