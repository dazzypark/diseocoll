// module import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faQuestion,
  faFile,
  faArrowRight,
  faCircleUp,
  faThumbsUp,
  faRightToBracket,
  faCrown,
  faCode,
  faCalendarDays,
  faPlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCookies } from "react-cookie";
import Image from "next/image";
import Link from "next/link";

import Toastfd from "../../utils/fire";

// css import
import styles from "../../styles/myproject.module.css";

// components import
import Navbar from "../../components/navbar";
import { ApiBaseURL } from "@/settings";

// 공식 렌더링
export default function App({ posts }) {
  let [SelectMenuTF, SelectMenuTFEd] = useState(false);

  return (
    <>
      <Head>
        <title>{`내 작품 - ${posts.username}`}</title>
        <meta name="description" content={`${posts.username}님의 봇, 서버들`} />
        <meta name="keywords" content={posts.username} />
        {/* <meta
          name="author"
          content={posts.admins.map((f) => f.tag.split("#")[0]).join(", ")}
        /> */}
        <meta
          name="og:site_name"
          content={"디서콜 - 디스코드 서버, 봇 홍보 사이트"}
        />
        <meta name="og:title" content={`내 작품 - ${posts.username}`} />
        <meta
          name="og:description"
          content={`${posts.username}님의 봇, 서버들`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:url"
          content={`https://diseocoll.com/MyProject/${posts.id}`}
        />
        <meta name="og:image" content={posts.iconURL} />
        <meta name="theme-color" content="#b6e324" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <Navbar
          links="true"
          SelectMenuTF={SelectMenuTF}
          SelectMenuTFEd={SelectMenuTFEd}
        />
        <div className={styles.MainPage}>
          <div className={styles.projectType}>서버</div>
          <div className={styles.projectList}>
            {posts.guilds.map((project) => (
              <div key={project.name}>
                <div
                  className={styles.project}
                  href={{
                    pathname: "/servers/[id]",
                    query: { id: project.id },
                  }}
                  key={project.name}
                >
                  <div className={styles.icon}>
                    <Image
                      src={project.iconURL}
                      alt={`${project.name} 프로필`}
                      width={30}
                      height={30}
                    ></Image>
                  </div>
                  <div className={styles.name}>{project.name}</div>
                  <div className={styles.Buttons}>
                    <Link
                      href={{
                        pathname: "/servers/[id]",
                        query: { id: project.id },
                      }}
                    >
                      <FontAwesomeIcon icon={faRightToBracket} />
                    </Link>
                    <Link
                      href={{
                        pathname: "/editserver/[id]",
                        query: { id: project.id },
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "orange" }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.projectType}>봇</div>
          <div className={styles.projectList}>
            {posts.bots.map((project) => (
              <div
                className={styles.project}
                href={{ pathname: "/bots/[id]", query: { id: project.id } }}
                key={project.name}
              >
                <div className={styles.icon}>
                  <Image
                    src={project.iconURL}
                    alt={`${project.name} 프로필`}
                    width={30}
                    height={30}
                  ></Image>
                </div>
                <div className={styles.name}>{project.name}</div>{" "}
                <div className={styles.Buttons}>
                  <Link
                    href={{
                      pathname: "/bots/[id]",
                      query: { id: project.id },
                    }}
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                  </Link>
                  <Link
                    href={{
                      pathname: "/editbot/[id]",
                      query: { id: project.id },
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ color: "orange" }}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// 사전 렌더링
export const getServerSideProps = async (context) => {
  const id = context.params.id;

  let add_server_req = await fetch(`${ApiBaseURL}/api/v1/etcs/loadMyProject`, {
    method: "POST",
    body: JSON.stringify({
      id: `${id}`,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (add_server_req.status != 200) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  const add_server_req_json = await add_server_req.json();

  return {
    props: {
      posts: add_server_req_json,
    },
  };
};
