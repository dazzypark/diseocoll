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
import Toastfd from "../utils/fire";
import Image from "next/image";

// css import
import styles from "../styles/addserver.module.css";

// components import
import Navbar from "../components/navbar";

// settings import
import { ApiBaseURL, domain } from "@/settings";
import { useRouter } from "next/router";
const categories = ["코딩", "게임", "친목", "수다", "이모지", "새벽"];

export default function AddServer() {
  const router = useRouter();

  // 쿠키들
  const [cookies, setCookies, removeCookies] = useCookies(["access_token"]);

  let [servers, Setservers] = useState([]);
  let [disableClick, setdisableClick] = useState(false);
  let [checkInviteBot, setcheckInviteBot] = useState(false);
  let [selectJoinOption, setselectJoinOption] = useState("0");
  let [customInviteCode, setcustomInviteCode] = useState("");

  // 백엔드 서버로 보낼 데이터들
  let [selectedCategories, setSelectedCategories] = useState([]);
  let [serverTitle, setserverTitle] = useState("");
  let [nowServer, SetnowServer] = useState({});
  let [serverDs, setserverDs] = useState("");

  useEffect(() => {
    // 서버 목록을 불러오는 함수
    const getServers = async () => {
      const getGuilds = await fetch(
        `https://discord.com/api/users/@me/guilds`,
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        }
      );
      if (getGuilds.status != 200) {
        alert("로그인 후 접근할 수 있습니다.");
        window.location.href = domain;
        return;
      }
      getGuilds.json().then(async (f) => {
        let first_go = false;
        for (let i = 0; i < f.length; i++) {
          if (permissions(f[i].permissions).includes("ADMINISTRATOR")) {
            if (first_go == false) {
              SetnowServer([f[i]]);
              first_go = true;
            }
            Setservers((oldAr) => [...oldAr, f[i]]);
          }
        }
      });
    };
    getServers();
  }, []);

  const searchGuild = (id) => {
    let select_sucess_gulid = servers.filter((f) => f.id == id);
    if (!select_sucess_gulid) return;
    SetnowServer(select_sucess_gulid);
  };

  const handleCategoryClick = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryDelete = (category) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const PostServerAdd = async () => {
    const Toastf = await Toastfd();

    if (!nowServer[0]?.id) {
      return Toastf.fire({
        icon: "warning",
        title: "추가할 서버를 선택해 주세요.",
      });
    }
    if (serverTitle.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "서버 소개를 입력해 주세요.",
      });
    }
    if (serverDs.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "서버 설명을 입력해 주세요.",
      });
    }
    if (selectedCategories.length == 0) {
      return Toastf.fire({
        icon: "warning",
        title: "카테고리를 최소 한 개 선택해 주세요.",
      });
    }

    if (checkInviteBot == false) {
      return Toastf.fire({
        icon: "warning",
        title: "2번 질문에 응답해 주세요.",
      });
    }

    if (selectJoinOption == 2 && customInviteCode == "") {
      return Toastf.fire({
        icon: "warning",
        title: "지정할 초대코드를 입력해 주세요",
      });
    }

    setdisableClick(true);

    let inviteCodeReqOnly;

    if (selectJoinOption == 2) {
      inviteCodeReqOnly = customInviteCode;
    } else {
      inviteCodeReqOnly = selectJoinOption;
    }

    let add_server_req = await fetch(`${ApiBaseURL}/api/v1/guilds/addGuild`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: nowServer[0].id,
        title: serverTitle,
        description: serverDs,
        JoinOption: inviteCodeReqOnly,
        category: selectedCategories,
        access_token: cookies.access_token,
      }),
    });

    // let add_server_req_json = await add_server_req.json();

    if (add_server_req.status == 404) {
      Toastf.fire({
        icon: "error",
        title: "서버에 봇이 초대되지 않았습니다.",
      });
    } else {
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
    }
    return;
  };

  let [SelectMenuTF, SelectMenuTFEd] = useState(false);

  return (
    <>
      <Head>
        <title>DISEOCOLL - 서버 등록</title>
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
          <div className={styles.PageTitle}>서버 등록</div>
          <div className={styles.Menus}>
            <div className={styles.SelectServer}>
              <div className={styles.SelectMent}>1. 서버를 선택해 주세요</div>
              <select
                className={styles.GuildsDropdown}
                onChange={(e) => {
                  searchGuild(e.target.value);
                }}
              >
                {servers.map((server) => (
                  <option
                    className={styles.GuildDropSelect}
                    key={server.id}
                    value={server.id}
                  >
                    {server.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.NowServerInfos}>
              <div className={styles.NowSelectServerIcon}>
                {nowServer[0]?.id && (
                  <Image
                    src={
                      nowServer[0]?.icon
                        ? `https://cdn.discordapp.com/icons/${
                            nowServer[0]?.id
                          }/${nowServer[0]?.icon}.${
                            nowServer[0]?.icon?.startsWith("a_") ? "gif" : "png"
                          }?size=4096`
                        : "https://i.imgur.com/GkuBFJZ.png"
                    }
                    alt={`${nowServer[0]?.name} 서버 아이콘`}
                    width={40}
                    height={40}
                  ></Image>
                )}
              </div>
              <div className={styles.NowSelectServerName}>
                {nowServer[0]?.name}
              </div>
            </div>
            {/*  */}
            <div className={styles.BotAddInServer}>
              <div className={styles.BotAddInServerMent}>
                2. 봇을 서버에 추가해 주세요
              </div>
              <input
                type="checkbox"
                onChange={() => {
                  setcheckInviteBot((f) => !f);
                }}
              />
              <label>
                &nbsp;{nowServer[0]?.name} 서버에&nbsp;
                <a
                  href={`https://discord.com/oauth2/authorize?client_id=1094190720740511854&scope=bot%20applications.commands&guild_id=${nowServer[0]?.id}`}
                  style={{ textDecoration: "none" }}
                  target={"_blank"}
                >
                  봇
                </a>
                을 초대했어요!
              </label>
            </div>
            <div className={styles.TypingServerTitle}>
              <div className={styles.TypingServerTitleMent}>
                3. 서버 소개를 적어주세요
              </div>
              <input
                placeholder="서버 소개를 적어주세요 (최대 20글자)"
                type={"text"}
                minLength={"1"}
                maxLength={"20"}
                onChange={(f) => {
                  setserverTitle(f.target.value);
                }}
              ></input>
            </div>
            <div className={styles.TypingServerDs}>
              <div className={styles.TypingServerDsMent}>
                4. 서버 설명을 적어주세요
              </div>
              <textarea
                // wrap="soft"
                placeholder="서버 설명을 자세하게 적어주세요 (최대 1400글자)"
                type={"text"}
                minLength={"1"}
                maxLength={"1400"}
                onChange={(f) => {
                  setserverDs(f.target.value);
                }}
              ></textarea>
            </div>
            <div className={styles.SelectServerST}>
              <div className={styles.SelectServerSTMent}>
                5. 서버 카테고리를 선택해 주세요
              </div>{" "}
              <select
                className={styles.SelectServerSTSelect}
                onChange={(e) => {
                  handleCategoryClick(e.target.value);
                }}
              >
                <option value={""}>서버 카테고리를 선택하세요.</option>

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
            <div className={styles.SelectJoinOption}>
              <div className={styles.SelectJoinOptionMent}>
                6. 서버 입장 방식을 선택해 주세요
              </div>
              <select
                className={styles.JoinOptionSelect}
                onChange={(e) => {
                  setselectJoinOption(e.target.value);
                }}
              >
                <option className={styles.JoinOptionOption} value="0">
                  [보안 상] 서버 참여하기 클릭 시 유저를 서버에 자동으로 참여
                </option>
                <option className={styles.JoinOptionOption} value="1">
                  [보안 중] 매번 1회용 초대코드 사용
                </option>
                <option className={styles.JoinOptionOption} value="2">
                  [보안 하] 초대코드 지정
                </option>
              </select>
            </div>
            {selectJoinOption == 2 && (
              <div className={styles.CustomInviteCode}>
                <div
                  className={styles.CustomInviteCodeMent}
                  placeholder="https://discord.gg/InviteCode"
                >
                  6-1. 지정할 초대코드를 입력해 주세요
                </div>{" "}
                <input
                  placeholder="초대코드를 적어주세요"
                  type={"text"}
                  minLength={"8"}
                  maxLength={"8"}
                  onChange={(f) => {
                    setcustomInviteCode(f.target.value);
                  }}
                ></input>
              </div>
            )}
            <div className={styles.AddServerSubmit}>
              <button
                className={styles.AddServerSubmitButton}
                onClick={async () => {
                  await PostServerAdd();
                }}
              >
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
