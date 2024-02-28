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
          <Link href="/">profile</Link>
        </div>
        <div>
          <Link href="/posts">posts</Link>
        </div>
        <div>
          <Link
            href="https://www.reddit.com/r/survivor/comments/gg06jd/nick_voted_out_but_everyone_is_nick/"
            target="blank"
          >
            probst
          </Link>
        </div>
        {/* <div>
          <a href="/projects">projects</a>
        </div> */}
      </nav>
    </header>
  );
}

function PersonalDescription(props) {
  return (
    <div className="flex-horizontal">
      <h1 className={headerStyles.name}>
        <Link href="/" className={utilStyles.colorInherit}>
          charlie mistrata
        </Link>
      </h1>
      <address className={headerStyles.logos}>
        <Link
          href="mailto:cmistrata@gmail.com"
          className={headerStyles.grow}
          title="Email"
        >
          <EmailIcon sx={{ color: "rgb(255, 99, 211)" }} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/charlie-mistrata/"
          className={headerStyles.grow}
          title="LinkedIn"
        >
          <LinkedInIcon sx={{ color: "rgb(31, 117, 255)" }} />
        </Link>
        <Link
          href="https://github.com/cmistrata"
          className={headerStyles.grow}
          title="GitHub"
        >
          <GitHubIcon sx={{ color: "rgb(27, 204, 139)" }} />
        </Link>
        <Link
          href="https://random.dog/"
          className={headerStyles.grow}
          title="Dog"
        >
          <PetsIcon sx={{ color: "rgb(128, 84, 101)" }} />
        </Link>
      </address>
    </div>
  );
}
