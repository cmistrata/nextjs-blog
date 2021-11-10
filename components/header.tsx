import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PetsIcon from "@mui/icons-material/Pets";
import utilStyles from "../styles/utils.module.css";
import headerStyles from "./header.module.css";
import Link from "next/link";
import useSWR from "swr";

export default function Header(props) {
  return (
    <header className={headerStyles.header}>
      <PersonalDescription />
      <div className={headerStyles.navlinks}>
        <div>
          <a href="/posts">posts</a>
        </div>
        <div>
          <a href="/posts">projects</a>
        </div>
        <div>
          <a href="/posts">profile</a>
        </div>
      </div>
    </header>
  );
}

function PersonalDescription(props) {
  return (
    <div className="flex-horizontal">
      <h1 className={utilStyles.headingLg}>
        <Link href="/">
          <a className={utilStyles.colorInherit}>charlie mistrata</a>
        </Link>
      </h1>
      <div className={headerStyles.logos}>
        <div className={headerStyles.one + " grow wiggle"}>
          <a href="mailto:cmistrata@gmail.com">
            <EmailIcon sx={{ color: "rgb(255, 99, 211)" }} />
          </a>
        </div>
        <div className={headerStyles.two + " grow"}>
          <a href="https://www.linkedin.com/in/charlie-mistrata/">
            <LinkedInIcon sx={{ color: "rgb(31, 117, 255)" }} />
          </a>
        </div>
        <div className={headerStyles.three + " grow"}>
          <a href="https://github.com/cmistrata">
            <GitHubIcon sx={{ color: "rgb(27, 204, 139)" }} />
          </a>
        </div>
        <div className={headerStyles.four + " grow"}>
          <a href="https://random.dog/">
            <PetsIcon sx={{ color: "rgb(128, 84, 101)" }} />
          </a>
        </div>
      </div>
    </div>
  );
}
