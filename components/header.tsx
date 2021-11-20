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
      <nav className={headerStyles.navlinks}>
        <div>
          <a href="/posts">posts</a>
        </div>
        <div>
          <a href="/projects">projects</a>
        </div>
        <div>
          <a href="/">profile</a>
        </div>
      </nav>
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
      <address className={headerStyles.logos}>
        <a href="mailto:cmistrata@gmail.com" className="grow">
          <EmailIcon sx={{ color: "rgb(255, 99, 211)" }} />
        </a>
        <a
          href="https://www.linkedin.com/in/charlie-mistrata/"
          className="grow"
        >
          <LinkedInIcon sx={{ color: "rgb(31, 117, 255)" }} />
        </a>
        <a href="https://github.com/cmistrata" className="grow">
          <GitHubIcon sx={{ color: "rgb(27, 204, 139)" }} />
        </a>
        <a href="https://random.dog/" className="grow">
          <PetsIcon sx={{ color: "rgb(128, 84, 101)" }} />
        </a>
      </address>
    </div>
  );
}
