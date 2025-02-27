import { BsFillChatSquareTextFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { MdOutlineSettingsInputComposite } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";

export const sideLinks = [
  {
    label: "All Chats",
    href: "/",
    icon: BsFillChatSquareTextFill,
  },
  {
    label: "Community",
    href: "/community",
    icon: RiUserCommunityLine,
  },
  {
    label: "Profile",
    href: "/profile/:id",
    icon: FaUser,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: MdOutlineSettingsInputComposite,
  },
];
