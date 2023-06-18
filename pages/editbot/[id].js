// module import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleRoof,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Head from "next/head";
import { permissions } from "discord-bitfield-calculator";
import Toastfd from "../../utils/fire";
import Image from "next/image";

// css import
import styles from "../../styles/addBot.module.css";

// components import
import Navbar from "../../components/navbar";

// settings import
import { ApiBaseURL, domain } from "@/settings";
import { useRouter } from "next/router";
const categories = ["코딩", "게임", "친목", "수다", "이모지", "새벽"];

export default function AddServer({ posts }) {
  const router = useRouter();

  // 쿠키들
  const [cookies, setCookies, removeCookies] = useCookies(["access_token"]);

  let [SelectMenuTF, SelectMenuTFEd] = useState(false);

  let [servers, Setservers] = useState([]);
  let [disableClick, setdisableClick] = useState(false);

  let [joinDevCerti, setjoinDevCerti] = useState(false);
  let [botAddCertiCmd, setbotAddCertiCmd] = useState(false);
  let [DevServerBotadd, setDevServerBotadd] = useState(false);
  let [vertiChUseCmd, setvertiChUseCmd] = useState(false);

  let [selectJoinOption, setselectJoinOption] = useState("0");
  let [customInviteCode, setcustomInviteCode] = useState("");

  const [text, setText] = useState("");
  const [prevText, setPrevText] = useState("");

  // 백엔드 서버로 보낼 데이터들
  let [selectedCategories, setSelectedCategories] = useState([]);
  let [serverTitle, setserverTitle] = useState("");
  let [nowServer, SetnowServer] = useState({});
  let [serverDs, setserverDs] = useState("");

  useEffect(() => {
    handleInputChange(posts.id);
    for (let i = 0; i < posts.category.length; i++) {
      handleCategoryClick(posts.category[i]);
    }
  });

  const handleCategoryClick = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryDelete = (category) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const PostServerAdd = async () => {
    let Toastf = await Toastfd();

    if (!nowServer.id) {
      return Toastf.fire({
        icon: "warning",
        title: "추가할 봇 아이디를 입력해 주세요.",
      });
    }

    if (
      joinDevCerti == false ||
      botAddCertiCmd == false ||
      DevServerBotadd == false ||
      vertiChUseCmd == false
    ) {
      return Toastf.fire({
        icon: "warning",
        title: "2번 질문에 응답해 주세요.",
      });
    }

    if (serverTitle.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "봇 소개를 입력해 주세요.",
      });
    }
    if (serverDs.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "봇 설명을 입력해 주세요.",
      });
    }

    if (selectedCategories.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "카테고리를 최소 한 개 선택해 주세요.",
      });
    }

    setdisableClick(true);

    let add_server_req = await fetch(`${ApiBaseURL}/api/v1/bots/addBot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: nowServer.id,
        title: serverTitle,
        description: serverDs,
        category: selectedCategories,
        access_token: cookies.access_token,
      }),
    });

    if (add_server_req.status == 428) {
      return Toastf.fire({
        icon: "error",
        title: "너무 빨리 누르고 있어요.",
      });
    }
    // let add_server_req_json = await add_server_req.json();

    if (add_server_req.status != 200) {
      Toastf.fire({
        icon: "error",
        title: "잘못된 접근입니다.",
      }).then(() => {
        router.push({ pathname: "/" }, undefined, { scroll: false });
      });
    } else {
      Toastf.fire({
        icon: "success",
        title: "서버가 등록되었습니다.",
      }).then(() => {
        router.push({ pathname: "/" }, undefined, { scroll: false });
      });
    }

    return;
  };

  const loadbot = async (id) => {
    let load_bot_req = await fetch(`${ApiBaseURL}/api/v1/bots/checkbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    if (load_bot_req.status == 200) {
      let load_bot_json = await load_bot_req.json();
      SetnowServer({
        id: id,
        tag: load_bot_json.tag,
        iconURL: load_bot_json.iconURL,
      });
      return;
    }
    SetnowServer({});
  };

  useEffect(() => {
    const text_trim = text.trim();
    if (
      text_trim === "" ||
      (text_trim.length !== 18 && text_trim.length !== 19)
    ) {
      SetnowServer({});
      return;
    }

    const timer = setTimeout(() => {
      if (text_trim === prevText) {
        loadbot(text_trim);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  const handleInputChange = (e) => {
    const inputText = e.target?.value || e;
    setText(inputText);
    if (inputText !== prevText) {
      setPrevText(inputText);
    }
  };

  return (
    <>
      <Head>
        <title>DISEOCOLL - 봇 수정</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="app">
        <Navbar SelectMenuTF={SelectMenuTF} SelectMenuTFEd={SelectMenuTFEd} />

        <div
          className={styles.MainPage}
          style={disableClick == true ? { pointerEvents: "none" } : {}}
          onClick={() => {
            SelectMenuTFEd(false);
          }}
        >
          <div className={styles.PageTitle}>봇 수정</div>
          <div className={styles.Menus}>
            <div className={styles.TypingServerTitle}>
              <div className={styles.TypingServerTitleMent}>
                1. 봇 아이디를 입력해 주세요
              </div>
              <input
                placeholder="봇 아이디를 입력해주세요"
                type={"text"}
                minLength={"18"}
                maxLength={"19"}
                defaultValue={posts.id}
                onChange={(f) => {
                  handleInputChange(f);
                }}
                readOnly={true}
              ></input>
            </div>
            {nowServer.tag && (
              <div className={styles.NowServerInfos}>
                <div className={styles.NowSelectServerIcon}>
                  <Image
                    src={nowServer.iconURL}
                    alt={`${nowServer.tag} 봇 프로필`}
                    width={40}
                    height={40}
                  ></Image>
                </div>
                <div className={styles.NowSelectServerName}>
                  {nowServer.tag}
                </div>
              </div>
            )}
            <div className={styles.BotAddInServer}>
              <div className={styles.BotAddInServerMent}>
                2. 개발자 인증을 해주세요
              </div>
              <div className={styles.BotAddCheck}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setjoinDevCerti((f) => !f);
                  }}
                />
                <label>
                  등록하려는 봇이 있는 서버에{" "}
                  <a
                    href={`https://discord.com/oauth2/authorize?client_id=1094190720740511854&permissions=8&scope=bot%20applications.commands`}
                    target={"_blank"}
                  >
                    디서콜봇
                  </a>
                  을 초대해 주세요
                </label>
              </div>
              <div className={styles.BotAddCheck}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setbotAddCertiCmd((f) => !f);
                  }}
                />
                <label>
                  봇에 개발자 인증 명령어를 추가해 주세요 ({" "}
                  <a href="https://srcb.in/vs21UPcWkQ" target="_blank">
                    js
                  </a>
                  ,&nbsp;
                  <a href="https://sourceb.in/MNsqaWOkIU" target="_blank">
                    py
                  </a>{" "}
                  )
                </label>
              </div>
              <div className={styles.BotAddCheck}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setDevServerBotadd((f) => !f);
                  }}
                />
                <label>
                  서버에 이름이 &quot;디서콜 개발자 인증&quot;인 채널을 생성해
                  주세요
                </label>
              </div>
              <div className={styles.BotAddCheck}>
                <input
                  type="checkbox"
                  onChange={() => {
                    setvertiChUseCmd((f) => !f);
                  }}
                />
                <label>
                  &ldquo;디서콜 개발자 인증&rdquo; 채널에서 <code>/개발자</code>{" "}
                  명령어를 입력해 주세요
                </label>
              </div>
            </div>
            <div className={styles.TypingServerTitle}>
              <div className={styles.TypingServerTitleMent}>
                3. 봇 소개를 적어주세요
              </div>
              <input
                placeholder="봇 소개를 적어주세요 (최대 20글자)"
                type={"text"}
                minLength={"1"}
                maxLength={"20"}
                defaultValue={posts.title}
                onChange={(f) => {
                  setserverTitle(f.target.value);
                }}
              ></input>
            </div>
            <div className={styles.TypingServerDs}>
              <div className={styles.TypingServerDsMent}>
                4. 봇 설명을 적어주세요
              </div>
              <textarea
                // wrap="soft"
                placeholder="봇 설명을 자세하게 적어주세요 (최대 1400글자)"
                type={"text"}
                minLength={"1"}
                maxLength={"1400"}
                defaultValue={posts.description}
                onChange={(f) => {
                  setserverDs(f.target.value);
                }}
              ></textarea>
            </div>
            <div className={styles.SelectServerST}>
              <div className={styles.SelectServerSTMent}>
                5. 봇 카테고리를 선택해 주세요
              </div>{" "}
              <select
                className={styles.SelectServerSTSelect}
                onChange={(e) => {
                  handleCategoryClick(e.target.value);
                }}
              >
                <option value={""}>봇 카테고리를 선택하세요.</option>

                {categories.map((server) => {
                  if (!selectedCategories.includes(server)) {
                    return (
                      <option key={server} value={server}>
                        {server}
                      </option>
                    );
                  }
                })}
              </select>{" "}
              <div className={styles.SelectedCategory}>
                <div className={styles.SelectCatorysBoxs}>
                  {selectedCategories.map((server) => {
                    return (
                      <div
                        className={styles.SelectCatorysBox}
                        key={server}
                        value={server}
                        onClick={() => {
                          handleCategoryDelete(server);
                        }}
                      >
                        {server}&nbsp;
                        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={styles.AddServerSubmit}>
              <button
                className={styles.AddServerSubmitButton}
                onClick={async () => {
                  await PostServerAdd();
                }}
              >
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> 수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 사전 렌더링
import { parse } from "cookie";

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  const cookies = parse(context.req.headers.cookie ?? "");
  if (!cookies.token || !cookies.access_token) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  const userResponseData = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${cookies.access_token}`,
    },
  });

  const userData = await userResponseData.json(); //이거

  let add_server_req = await fetch(`${ApiBaseURL}/api/v1/bots/loadBot`, {
    method: "POST",
    body: JSON.stringify({
      botid: `${id}`,
      mode: "edit",
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

  let developers;
  try {
    developers = JSON.parse(add_server_req_json.bot.developers);
  } catch (error) {}

  if (!developers.includes(userData.id)) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  return {
    props: {
      posts: add_server_req_json.bot,
    },
  };
};
