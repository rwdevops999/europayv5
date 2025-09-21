import { absoluteUrl } from "@/lib/util";
import { FaTasks, FaUser, FaUsersCog } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";
import { GiBookCover, GiScrollUnfurled, GiSettingsKnobs } from "react-icons/gi";
import { GrStorage, GrTasks, GrTest, GrTransaction } from "react-icons/gr";
import { IoIosKey } from "react-icons/io";
import { IoListOutline } from "react-icons/io5";
import { LuClipboardList, LuHistory, LuLayoutDashboard } from "react-icons/lu";
import { MdSettingsAccessibility } from "react-icons/md";
import { PiExportFill, PiSpeedometerDuotone } from "react-icons/pi";
import { RiAdminFill, RiPoliceBadgeLine } from "react-icons/ri";
import {
  TbApi,
  TbDatabaseExport,
  TbDatabaseImport,
  TbTestPipe,
} from "react-icons/tb";

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
  {
    url: "#",
    title: "Lists",
    disabled: false,
    visible: true,
    icon: <IoListOutline size={16} />,
    subItems: [
      {
        title: "Tasks",
        url: absoluteUrl("/tasks"),
        disabled: false,
        visible: true,
        icon: <FaTasks size={16} />,
        subItems: [],
        parent: "Lists",
      },
      {
        title: "Jobs",
        url: absoluteUrl("/jobs"),
        disabled: false,
        visible: true,
        icon: <GrTasks size={16} />,
        subItems: [],
      },
      {
        url: absoluteUrl("/transactions"),
        title: "Transactions",
        disabled: false,
        visible: true,
        icon: <GrTransaction size={16} />,
        subItems: [],
      },
      {
        url: absoluteUrl("/history"),
        title: "History",
        disabled: false,
        visible: true,
        icon: <LuHistory size={16} />,
        subItems: [],
      },
      {
        url: absoluteUrl("/exports"),
        title: "Exports",
        disabled: false,
        visible: false,
        icon: <PiExportFill size={16} />,
        subItems: [],
      },
    ],
  },
  {
    url: "#",
    title: "Settings",
    disabled: false,
    visible: true,
    icon: <GiSettingsKnobs size={16} />,
    subItems: [
      {
        title: "General",
        url: absoluteUrl("/settings/general"),
        disabled: false,
        visible: true,
        icon: <MdSettingsAccessibility size={16} />,
        subItems: [],
        parent: "Settings",
      },
      {
        title: "Storage",
        url: absoluteUrl("/settings/storage"),
        disabled: false,
        visible: true,
        icon: <GrStorage size={16} />,
        subItems: [],
        parent: "Settings",
      },
      {
        title: "Limits",
        url: absoluteUrl("/settings/limits"),
        disabled: false,
        visible: true,
        icon: <PiSpeedometerDuotone size={16} />,
        subItems: [],
        parent: "Settings",
      },
      {
        title: "Export",
        url: absoluteUrl("/settings/export"),
        disabled: false,
        visible: true,
        icon: <TbDatabaseExport size={16} />,
        subItems: [],
        parent: "Settings",
      },
      {
        title: "Import",
        url: absoluteUrl("/settings/import"),
        disabled: false,
        visible: true,
        icon: <TbDatabaseImport size={16} />,
        subItems: [],
        parent: "Settings",
      },
    ],
  },
  {
    title: "Admin",
    url: absoluteUrl("/admin"),
    disabled: false,
    visible: false,
    subItems: [],
    icon: <RiAdminFill size={16} />,
  },
  {
    title: "User",
    url: absoluteUrl("/user"),
    disabled: false,
    visible: false,
    subItems: [],
    icon: <FaUsersCog size={16} />,
  },
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
  {
    url: absoluteUrl("/manual"),
    title: "Manual",
    disabled: false,
    visible: true,
    icon: <GiBookCover size={16} />,
    subItems: [],
  },
  {
    url: absoluteUrl("/api"),
    title: "API",
    disabled: false,
    visible: true,
    icon: <TbApi size={16} />,
  },
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
      {
        title: "TestUI",
        url: absoluteUrl("/tests/testui"),
        disabled: false,
        visible: true,
        icon: <TbTestPipe size={16} />,
        subItems: [],
        parent: "Tests",
      },
      {
        title: "TestSocket",
        url: absoluteUrl("/tests/testsocket"),
        disabled: false,
        visible: true,
        icon: <TbTestPipe size={16} />,
        subItems: [],
        parent: "Tests",
      },
      {
        title: "TestIamAccess",
        url: absoluteUrl("/tests/testiamaccess"),
        disabled: false,
        visible: true,
        icon: <TbTestPipe size={16} />,
        subItems: [],
        parent: "Tests",
      },
      {
        title: "TestJobs",
        url: absoluteUrl("/tests/testjobs"),
        disabled: false,
        visible: true,
        icon: <TbTestPipe size={16} />,
        subItems: [],
        parent: "Tests",
      },
    ],
  },
];
