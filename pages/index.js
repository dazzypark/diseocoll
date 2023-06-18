// emoji import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faArrowPointer,
  faRobot,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

// module import
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

// alert module
import Toastfd from "../utils/fire";

// css import
import styles from "../styles/index.module.css";

// components import
import Navbar from "../components/navbar";
import Link from "next/link";
import Paging from "../components/paging";
import SearchBar from "../components/searchbar";

// setting import
import { ApiBaseURL, domain } from "@/settings";

// datas
let standards = [
  "범프",
  "추천",
  "생성일 높은순",
  "생성일 낮은순",
  "등록일 높은순",
  "등록일 낮은순",
];

let standard_trans = {
  범프: "bump",
  추천: "recommend",
  "생성일 낮은순": "createdTimestampDOWN",
  "생성일 높은순": "createdTimestampUP",
  "등록일 낮은순": "createdAtDOWN",
  "등록일 높은순": "createdAtUP",
};

export default function Home({
  guilds,
  guild_standard,
  guild_nowpage,
  guild_searchresult,

  bots,
  bot_standard,
  bot_nowpage,
  bot_searchresult,
}) {
  // 렌더링 변수들

  // 쿠키들
  const [cookies, setCookies, removeCookies] = useCookies(["access_token"]);

  // 라우터
  const router = useRouter();

  let [SelectMenuTF, SelectMenuTFEd] = useState(false);

  useEffect(() => {
    // 페이지 로딩됐을 때 경고 메세지 띄워주는 콘솔 경고 함수
    function printWarn() {
      console.log("%c경고", "color: red;font-size: 34pt; font-weight: bold;");
      console.log(
        "%c이 기능은 개발자용으로 브라우저에서 제공되는 내용입니다. 일반 사용자에게 제공되지 않습니다.",
        "font-family: NanumSquare;font-size: 18pt; font-weight: bold;"
      );
      console.log(
        "%cSelf-XSS 공격을 방지하기 위해 개발자 도구를 사용할 수 없습니다.",
        "font-family: NanumSquare;font-size: 18pt; font-weight: bold;"
      );
      console.log(
        "%c이를 무시하고 계속 진행하거나 우회를 시도할경우 사이트 접속이 차단될 수 있습니다.",
        "color:red;font-family: NanumSquare;font-size: 18pt; font-weight: RED;"
      );
      console.log(
        "%c자세한 정보는 https://disecoll.coom/privacy 에서 확인해주세요.",
        "font-family: NanumSquare;font-size: 18pt;"
      );
    }
    printWarn();
  }, []);

  async function joinGuild(guildID) {
    const Toastf = await Toastfd();

    if (!cookies.access_token) {
      Toastf.fire({
        icon: "error",
        title: "로그인 후 접근할 수 있습니다.",
      });
      return;
    }

    const userResponseData = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });

    if (userResponseData.status != 200) {
      alert("로그인 후 접근할 수 있습니다.");
      return;
    }

    const userData = await userResponseData.json(); //이거

    const userPutResponseData = await fetch(
      `${ApiBaseURL}/api/v1/guilds/addUser`,
      {
        method: "POST",
        body: JSON.stringify({
          guildid: `${guildID}`,
          userid: `${userData.id}`,
          access_token: cookies.access_token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (userPutResponseData.status == 204) {
      //이미 서버에 있음
      return Toastf.fire({
        icon: "error",
        title: "해당 서버에 이미 가입되어 있습니다.",
      });
    }

    if (userPutResponseData.status == 201) {
      //서버에 추가함
      return Toastf.fire({
        icon: "success",
        title: "해당 서버에 가입되었습니다.",
      });
    }
    if (userPutResponseData.status == 403) {
      return Toastf.fire({
        icon: "error",
        title: "해당 서버에서 영구 추방당하셨습니다.",
      });
    }
    //오류 발생
    return Toastf.fire({
      icon: "error",
      title: "오류가 발생했습니다.",
    });
  }

  async function createOnlyOneInviteCode(guildID) {
    const userResponseData = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });

    if (userResponseData.status != 200) {
      alert("로그인 후 접근할 수 있습니다.");
      return;
    }

    const userData = await userResponseData.json(); //이거
    const userPutResponse = await fetch(
      `${ApiBaseURL}/api/v1/guilds/createOnlyOneInvite`,
      {
        method: "POST",
        body: JSON.stringify({
          guildid: `${guildID}`,
          userid: `${userData.id}`,
          access_token: cookies.access_token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (userPutResponse.status != 200) {
      const Toastf = await Toastfd();

      return Toastf.fire({ title: "오류가 발생했습니다", icon: "error" });
    }

    const userPutResponseData = await userPutResponse.json();

    window.open(`https://discord.gg/${userPutResponseData.code}`);
  }

  function convertDiscordTimestamp(timestamp) {
    if (timestamp == 0) {
      return `없음`;
    }
    const date = new Date(timestamp); // Discord 타임스탬프는 초 단위이므로 1000을 곱해 밀리초 단위로 변환
    const now = new Date();
    let diff = Math.floor((now - date) / 1000); // 초 단위로 시간 차이 계산

    if (diff < 60) {
      return `${diff}초 전`;
    } else if (diff < 3600) {
      const minDiff = Math.floor(diff / 60);
      return `${minDiff}분 전`;
    } else if (diff < 86400) {
      const hourDiff = Math.floor(diff / 3600);
      return `${hourDiff}시간 전`;
    } else if (diff < 2592000) {
      const dayDiff = Math.floor(diff / 86400);
      return `${dayDiff}일 전`;
    } else {
      const monthDiff = Math.floor(diff / 2592000);
      return `${monthDiff}달 전`;
    }
  }

  function changeSort(value) {
    router.push(
      {
        pathname: "/",
        query: Object.assign({}, router.query, { standard: value }),
      },
      undefined,
      { scroll: false }
    );
    return;
  }

  function changeBotSort(value) {
    router.push(
      {
        pathname: "/",
        query: Object.assign({}, router.query, { botstandard: value }),
      },
      undefined,
      { scroll: false }
    );
    return;
  }

  return (
    <>
      <Head>
        <title>디서콜 - 디스코드 서버, 봇 홍보 사이트</title>
        <meta
          name="description"
          content="자신의 디스코드 서버, 봇을 홍보하세요!"
        />
        <meta name="keywords" content="디스코드, 서버, 봇, 홍보" />
        <meta name="author" content="대찌, 레무링, 현성" />
        <meta
          name="og:title"
          content={"디서콜 - 디스코드 서버, 봇 홍보 사이트"}
        />
        <meta
          name="og:description"
          content={"자신의 디스코드 서버, 봇을 홍보하세요!"}
        />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={`https://diseocoll.com/`} />
        <meta name="og:image" content={"https://i.imgur.com/GkuBFJZ.png"} />
        <meta name="theme-color" content="#b6e324" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <Navbar
          links="true"
          SelectMenuTF={SelectMenuTF}
          SelectMenuTFEd={SelectMenuTFEd}
        />
        {/* 서버 리스트 */}
        <div
          className={styles.MainPage}
          onClick={() => {
            SelectMenuTFEd(false);
          }}
        >
          <div className={styles.ServerListLabel}>
            <FontAwesomeIcon icon={faPeopleRoof} color={"#57f287"} /> 서버
            리스트{" "}
          </div>
          <span style={{ color: "white" }}>정렬 기준 : </span>
          <select
            className={styles.SortOption}
            onChange={(e) => {
              changeSort(e.target.value);
            }}
            defaultValue={guild_standard}
          >
            {standards.map((stand, index) => (
              <option value={standard_trans[stand]} key={index}>
                {stand}
              </option>
            ))}
          </select>

          <SearchBar guilds={guild_searchresult} type={"guild"} />

          <div className={styles.Servers}>
            {guilds.map((f) => (
              <Link
                className={styles.Server}
                key={f.guildId}
                href={{ pathname: "/servers/[id]", query: { id: f.guildId } }}
              >
                <div className={styles.ServerIcon}>
                  {" "}
                  <Image
                    src={f.iconURL}
                    alt={"서버 아이콘"}
                    width={100}
                    height={100}
                  ></Image>{" "}
                </div>
                <div className={styles.ServerName}> {f.name}</div>
                <div className={styles.ServerDs}>{f.title}</div>
                <div className={styles.ServerCategoryLabel}>카테고리</div>
                <div className={styles.ServerCategory}>
                  {f.category.map((f) => (
                    <div key={f} className={styles.ServerCategoryBox}>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={styles.ServerJoinButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    f.JoinOption = f.JoinOption || "0";
                    if (f.JoinOption == 0) {
                      // oauth2 강제 입장
                      joinGuild(f.guildId);
                      return;
                    }
                    if (f.JoinOption == 1) {
                      // 1회용 초대코드
                      createOnlyOneInviteCode(f.guildId);
                      return;
                    }
                    // 직접 입력하기 초대코드
                    window.open(`https://discord.com/invite/${f.JoinOption}`);
                  }}
                >
                  &nbsp;
                  <FontAwesomeIcon icon={faArrowPointer} /> 서버 입장하기
                </button>
                <div className={styles.BumpAndRecommend}>
                  <div
                    className={styles.BumpTimestamp}
                    style={
                      guild_standard == "bump"
                        ? {
                            color: "#ff0044",
                            opacity: "0.8",
                            textDecorationColor: "red",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                  >
                    마지막 범프 : {convertDiscordTimestamp(f.bump || 0)}
                  </div>
                  <div
                    className={styles.RecommendCount}
                    style={
                      guild_standard == "recommend"
                        ? {
                            color: "#ff0044",
                            opacity: "0.8",
                            textDecorationColor: "red",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                  >
                    추천 수 : {f.recommend}개
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Paging NowPage={guild_nowpage / 12} type={"guild"} />
        </div>
        {/* 봇 리스트 */}
        <div className={styles.MainPage}>
          <div className={styles.ServerListLabel}>
            <FontAwesomeIcon icon={faRobot} color={"#5865f2"} /> 봇 리스트{" "}
          </div>
          <span style={{ color: "white" }}>정렬 기준 : </span>
          <select
            className={styles.SortOption}
            onChange={(e) => {
              changeBotSort(e.target.value);
            }}
            defaultValue={bot_standard}
          >
            {standards.map((stand, index) => (
              <option value={standard_trans[stand]} key={index}>
                {stand}
              </option>
            ))}
          </select>
          <SearchBar guilds={bot_searchresult} type={"bot"} />
          <div className={styles.Servers}>
            {bots.map((f) => (
              <Link
                className={styles.Server}
                key={f.id}
                href={{ pathname: "/bots/[id]", query: { id: f.id } }}
              >
                <div className={styles.ServerIcon}>
                  {" "}
                  <Image
                    src={f.iconURL}
                    alt={"서버 아이콘"}
                    width={100}
                    height={100}
                  ></Image>{" "}
                </div>
                <div className={styles.ServerName}>
                  {f.name}{" "}
                  {f.verify ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      color={"blue"}
                      style={{
                        backgroundColor: "skyblue",
                        borderRadius: "10px",
                        width: "40px",
                      }}
                      title="인증된 봇"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.ServerDs}>{f.title}</div>
                <div className={styles.ServerCategoryLabel}>카테고리</div>
                <div className={styles.ServerCategory}>
                  {f.category.map((f) => (
                    <div key={f} className={styles.ServerCategoryBox}>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={styles.ServerJoinButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      `https://discord.com/oauth2/authorize?client_id=${f.id}&permissions=8&scope=bot%20applications.commands`
                    );
                  }}
                >
                  &nbsp;
                  <FontAwesomeIcon icon={faArrowPointer} /> 봇 초대하기
                </button>
                <div className={styles.BumpAndRecommend}>
                  <div
                    className={styles.BumpTimestamp}
                    style={
                      bot_standard == "bump"
                        ? {
                            color: "#ff0044",
                            opacity: "0.8",
                            textDecorationColor: "red",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                  >
                    마지막 범프 : {convertDiscordTimestamp(f.bump || 0)}
                  </div>
                  <div
                    className={styles.RecommendCount}
                    style={
                      bot_standard == "recommend"
                        ? {
                            color: "#ff0044",
                            opacity: "0.8",
                            textDecorationColor: "red",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                  >
                    추천 수 : {f.recommend}개
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Paging NowPage={bot_nowpage / 12} type={"bot"} />
          Copyright 2023. 대찌 all rights reserved.
        </div>
      </div>
    </>
  );
}

// 사전 렌더링
export const getServerSideProps = async (context) => {
  const servers_limit = context.query.servers || 12;
  const servers_standard = context.query.standard || "bump";
  const servers_search = context.query.search;

  const bots_limit = context.query.bots || 12;
  const bots_standard = context.query.botstandard || "bump";
  const bots_search = context.query.botsearch;

  let server_search_result;
  let bot_search_result;

  let guilds = [];

  let bots = [];

  // 만약 서버 리밋이 12의 배수가 아니라면 return
  if (servers_limit % 12 != 0 || servers_limit < 12) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  // 만약 봇 리밋이 12의 배수가 아니라면 return
  if (bots_limit % 12 != 0 || bots_limit < 12) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  // 서버 검색 함수
  const servers_search_function = async () => {
    let search_server_req = await fetch(`${ApiBaseURL}/api/v1/guilds/search`, {
      method: "POST",
      body: JSON.stringify({
        query: servers_search,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (search_server_req.status != 200) {
      return {};
    }

    const search_server_json = await search_server_req.json();

    return search_server_json.guilds;
  };

  // 봇 검색 함수
  const bot_search_function = async () => {
    let search_server_req = await fetch(`${ApiBaseURL}/api/v1/bots/search`, {
      method: "POST",
      body: JSON.stringify({
        query: bots_search,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (search_server_req.status != 200) {
      return {};
    }

    const search_server_json = await search_server_req.json();

    return search_server_json.bots;
  };

  // 캐시가 없다면 서버들 불러오기 함수
  async function loadGuildFC() {
    async function loadsingleGuild(id) {
      let add_server_req = await fetch(
        `${ApiBaseURL}/api/v1/guilds/loadGuild`,
        {
          method: "POST",
          body: JSON.stringify({
            serverid: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const add_server_req_json = await add_server_req.json();
      return add_server_req_json.guild;
    }

    let add_server_req = await fetch(
      `${ApiBaseURL}/api/v1/guilds/loadGuilds?limit=${servers_limit}&standard=${servers_standard}`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (add_server_req.status !== 200) {
      return "error";
    }

    let add_server_req_json = await add_server_req.json();

    let guildIconPromises = add_server_req_json.guilds.map(async (guild) => {
      const guildIcon_get = await loadsingleGuild(guild.guildId);
      guild.name = guildIcon_get.name;
      guild.iconURL = guildIcon_get.iconURL;
      return guild;
    });

    guilds = await Promise.all(guildIconPromises);
  }

  // 캐시가 없다면 서버들 불러오기 함수
  async function loadBotFC() {
    async function loadsingleBot(id) {
      let add_server_req = await fetch(`${ApiBaseURL}/api/v1/bots/loadBot`, {
        method: "POST",
        body: JSON.stringify({
          botid: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const add_server_req_json = await add_server_req.json();
      return add_server_req_json.bot;
    }

    let add_server_req = await fetch(
      `${ApiBaseURL}/api/v1/bots/loadBots?limit=${bots_limit}&standard=${bots_standard}`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (add_server_req.status !== 200) {
      return "error";
    }

    let add_server_req_json = await add_server_req.json();

    let botIconPromises = add_server_req_json.bots.map(async (bot) => {
      const botIcon_get = await loadsingleBot(bot.id);
      bot.name = botIcon_get.name;
      bot.verify = botIcon_get.verify;
      bot.iconURL = botIcon_get.iconURL;
      return bot;
    });

    bots = await Promise.all(botIconPromises);
  }

  const [result_bot, result_server] = await Promise.all([
    loadBotFC(),
    loadGuildFC(),
  ]);

  if (result_server == "error") {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  if (servers_search) {
    server_search_result = await servers_search_function();
  } else {
    server_search_result = null;
  }

  if (result_bot == "error") {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  if (bots_search) {
    bot_search_result = await bot_search_function();
  } else {
    bot_search_result = null;
  }

  return {
    props: {
      guilds: guilds,
      guild_standard: servers_standard,
      guild_nowpage: servers_limit,
      guild_searchresult: server_search_result || null,

      bots: bots,
      bot_standard: bots_standard,
      bot_nowpage: bots_limit,
      bot_searchresult: bot_search_result || null,
    },
  };
};
