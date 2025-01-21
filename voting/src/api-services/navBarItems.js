import hckLogo from "../assests/images/kenya-flag.jpg";
import {FaComment} from "react-icons/fa";
import {summaryVotes} from "./votes/votes";

export const navBarItems = {
    comments: <FaComment/>,
};

export const logo = {
    src: hckLogo,
    alt: "logo",
};

await summaryVotes()