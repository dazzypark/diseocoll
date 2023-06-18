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
  faCalendarDays,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useCookies } from "react-cookie";
import Image from "next/image";

import Toastfd from "../../utils/fire";

// css import
import styles from "../../styles/server.module.css";

// components import
import Navbar from "../../components/navbar";
import { ApiBaseURL, recaptcha_sitekey } from "@/settings";

import ReCAPTCHA from "react-google-recaptcha";

// 공식 렌더링
export default function App({ posts }) {
  const [cookies, setCookies, removeCookies] = useCookies(["access_token"]);

  let [SelectMenuTF, SelectMenuTFEd] = useState(false);
  let [Recaptcha, setRecaptcha] = useState("");

  const regex =
    /(https:\/\/cdn.discordapp.com\/attachments\/(\d+\/\d+\/\S+\.(png|jpg|jpeg|gif|webp)))/gi; // Discord CDN 링크를 찾는 정규식

  function handleRecaptchaChange(value) {
    setRecaptcha(value);
  }

  function yyyymmdd(timestamp) {
    var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = "PM";
    } else if (hh === 12) {
      h = 12;
      ampm = "PM";
    } else if (hh == 0) {
      h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = `${yyyy}년 ${mm}월 ${dd}일 ${ampm} ${h}:${min}`;

    return time;
  }

  function getTimeAgo(timestamp) {
    if (!timestamp) {
      return "없음";
    }
    const MS_PER_HOUR = 3600000;
    const MS_PER_DAY = 86400000;
    const MS_PER_MONTH = 2629800000;
    const MS_PER_YEAR = 31557600000;

    const now = new Date().getTime();
    const diff = now - timestamp;

    if (diff < MS_PER_HOUR) {
      let minutes = Math.floor(diff / 60000);
      if (minutes == 0) {
        minutes = 1;
      }
      return `${minutes}분 전`;
    } else if (diff < MS_PER_HOUR * 24) {
      const hours = Math.floor(diff / MS_PER_HOUR);
      return `${hours}시간 전`;
    } else if (diff < MS_PER_DAY * 30) {
      const days = Math.floor(diff / MS_PER_DAY);
      return `${days}일 전`;
    } else if (diff < MS_PER_MONTH * 12) {
      const months = Math.floor(diff / MS_PER_MONTH);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diff / MS_PER_YEAR);
      return `${years}년 전`;
    }
  }

  const dsc_guild_addTimestamp = new Date(posts.timestamps).getTime();
  const dsc_guild_addToText = yyyymmdd(dsc_guild_addTimestamp);

  const guildNameRef = useRef(null);

  // 웹사이트 로딩 후 실행
  useEffect(() => {
    const textNode = guildNameRef.current;
    let fontSize = 100;
    while (textNode.clientWidth > 140) {
      fontSize -= 1;
      textNode.style.fontSize = `${fontSize}px`;
    }
  }, []);

  function getTimeDifference(timestamp) {
    const now = new Date().getTime();
    const difference = timestamp - now;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 1) {
      return `${hours}시간 후`;
    } else {
      return `${minutes}분 후`;
    }
  }

  async function bump() {
    const Toastf = await Toastfd();

    if (!cookies.access_token) {
      return Toastf.fire({
        icon: "error",
        title: "로그인 후 접근할 수 있습니다.",
      });
    }

    if (Recaptcha == "") {
      return Toastf.fire({
        icon: "warning",
        title: "캡챠를 풀어주세요.",
      });
    }

    let add_server_req = await fetch(`${ApiBaseURL}/api/v1/guilds/bump`, {
      method: "POST",
      body: JSON.stringify({
        id: posts.id,
        access_token: cookies.access_token,
        gRecaptchaToken: Recaptcha,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (add_server_req.status == 428) {
      return Toastf.fire({
        icon: "error",
        title: "너무 빨리 누르고 있어요.",
      });
    }

    if (add_server_req.status == 405) {
      return Toastf.fire({
        icon: "warning",
        title: "캡챠를 풀어주세요.",
      });
    }

    if (add_server_req.status == 400) {
      return Toastf.fire({
        icon: "error",
        title: "서버에 접속하신 후 접근할 수 있습니다.",
      });
    }

    if (add_server_req.status == 429) {
      const add_server_req_json = await add_server_req.json();
      return Toastf.fire({
        icon: "error",
        title: `${getTimeDifference(
          add_server_req_json.message
        )}에 사용하실 수 있습니다.`,
      });
    }

    if (add_server_req.status == 200) {
      return Toastf.fire({ icon: "success", title: `범프되었습니다.` });
    }

    return Toastf.fire({ icon: "error", title: `오류가 발생했습니다.` });
  }

  async function recommend() {
    const Toastf = await Toastfd();

    if (!cookies.access_token) {
      return Toastf.fire({
        icon: "error",
        title: "로그인 후 접근할 수 있습니다.",
      });
    }

    if (Recaptcha == "") {
      return Toastf.fire({
        icon: "warning",
        title: "캡챠를 풀어주세요.",
      });
    }

    let add_server_req = await fetch(`${ApiBaseURL}/api/v1/guilds/recommend`, {
      method: "POST",
      body: JSON.stringify({
        id: posts.id,
        access_token: cookies.access_token,
        gRecaptchaToken: Recaptcha,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (add_server_req.status == 428) {
      return Toastf.fire({
        icon: "error",
        title: "너무 빨리 누르고 있어요.",
      });
    }

    if (add_server_req.status == 405) {
      return Toastf.fire({
        icon: "warning",
        title: "캡챠를 풀어주세요.",
      });
    }

    if (add_server_req.status == 400) {
      return Toastf.fire({
        icon: "error",
        title: "서버에 접속하신 후 접근할 수 있습니다.",
      });
    }

    if (add_server_req.status == 429) {
      const add_server_req_json = await add_server_req.json();
      return Toastf.fire({
        icon: "error",
        title: `${getTimeDifference(
          add_server_req_json.message
        )}에 사용하실 수 있습니다.`,
      });
    }

    if (add_server_req.status == 200) {
      return Toastf.fire({ icon: "success", title: `서버를 추천했습니다.` });
    }

    return Toastf.fire({ icon: "error", title: `오류가 발생했습니다.` });
  }

  async function serverjoin() {
    posts.JoinOption = posts.JoinOption || "0";
    if (posts.JoinOption == 0) {
      // oauth2 강제 입장
      joinGuild(posts.id);
      return;
    }
    if (posts.JoinOption == 1) {
      // 1회용 초대코드
      createOnlyOneInviteCode(posts.id);
      return;
    }
    // 직접 입력하기 초대코드
    window.open(`https://discord.com/invite/${posts.JoinOption}`);
  }

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
      Toastf.fire({
        icon: "error",
        title: "로그인 후 접근할 수 있습니다.",
      });
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

    if (userPutResponseData.status == 405) {
      return Toastf.fire({
        icon: "warning",
        title: "캡챠를 풀어주세요.",
      });
    }

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

  return (
    <>
      <Head>
        <title>{`서버 - ${posts.name}`}</title>
        <meta name="description" content={posts.title} />
        <meta name="keywords" content={posts.category.join(", ")} />
        <meta
          name="author"
          content={posts.admins.map((f) => f.tag.split("#")[0]).join(", ")}
        />
        <meta
          name="og:site_name"
          content={"디서콜 - 디스코드 서버, 봇 홍보 사이트"}
        />
        <meta name="og:title" content={`서버 - ${posts.name}`} />
        <meta name="og:description" content={posts.title} />
        <meta name="og:type" content="website" />
        <meta
          name="og:url"
          content={`https://diseocoll.com/servers/${posts.id}`}
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
        <div
          className={styles.MainPage}
          onClick={() => {
            SelectMenuTFEd(false);
          }}
        >
          <div className={styles.ServerPage}>
            <div className={styles.ZeroLineMoM}>
              <div className={styles.ZeroLine}>
                <div className={styles.InfoName}>
                  <FontAwesomeIcon icon={faCalendarDays} color={"#de2e43"} />{" "}
                  서버 생성일
                </div>
                <div className={styles.InfoValue}>
                  <FontAwesomeIcon icon={faArrowRight} color={"grey"} />{" "}
                  {yyyymmdd(posts.createdTimestamp)} (
                  <span style={{ color: "blue" }}>
                    {getTimeAgo(posts.createdTimestamp)}
                  </span>
                  )
                </div>

                <div className={styles.InfoName}>
                  <FontAwesomeIcon icon={faPlus} color={"#22a559"} /> 서버
                  등록일
                </div>
                <div className={styles.InfoValue}>
                  <FontAwesomeIcon icon={faArrowRight} color={"grey"} />{" "}
                  {dsc_guild_addToText} (
                  <span style={{ color: "blue" }}>
                    {getTimeAgo(dsc_guild_addTimestamp)})
                  </span>
                </div>

                <div className={styles.InfoName}>
                  <FontAwesomeIcon icon={faPeopleRoof} color={"#57f287"} /> 인원
                  수
                </div>
                <div className={styles.InfoValue}>
                  <FontAwesomeIcon icon={faArrowRight} color={"grey"} />{" "}
                  <span style={{ color: "red" }}>{posts.memberCount}</span>명
                  (온라인{" "}
                  <span style={{ color: "#22a559" }}>
                    {posts.memberCount - posts.offlineMemberCount}
                  </span>
                  , 오프라인{" "}
                  <span style={{ color: "orange" }}>
                    {posts.offlineMemberCount}
                  </span>
                  )
                </div>

                <div className={styles.InfoName}>
                  <FontAwesomeIcon icon={faThumbsUp} color={"#fbceb1"} /> 추천
                  수
                </div>
                <div className={styles.InfoValue}>
                  <FontAwesomeIcon icon={faArrowRight} color={"grey"} />{" "}
                  <span style={{ color: "#00FF7F" }}>{posts.recommend}</span>개
                </div>

                <div className={styles.InfoName}>
                  <FontAwesomeIcon icon={faCircleUp} color={"orange"} /> 최근
                  범프
                </div>
                <div className={styles.InfoValue}>
                  <FontAwesomeIcon icon={faArrowRight} color={"grey"} />{" "}
                  <span style={{ color: "blue" }}>
                    {getTimeAgo(posts.bump)}
                  </span>
                </div>
              </div>
              <div className={styles.FirstLine}>
                <div className={styles.ServerIcon}>
                  {" "}
                  <Image
                    src={posts.iconURL}
                    className={styles.ServerIconImg}
                    alt={`${posts.name} 서버 아이콘`}
                    width={300}
                    height={300}
                  ></Image>{" "}
                </div>
                <div className={styles.ServerName} ref={guildNameRef}>
                  {posts.name}
                </div>
              </div>

              <div className={styles.SecondLine}>
                <div className={styles.Buttons}>
                  <button
                    onClick={() => {
                      bump();
                    }}
                  >
                    범프하기{" "}
                    <FontAwesomeIcon icon={faCircleUp} color={"orange"} />
                  </button>
                  <button
                    onClick={() => {
                      recommend();
                    }}
                  >
                    추천하기{" "}
                    <FontAwesomeIcon icon={faThumbsUp} color={"#fbceb1"} />
                  </button>
                  <button
                    onClick={() => {
                      serverjoin();
                    }}
                  >
                    입장하기{" "}
                    <FontAwesomeIcon
                      icon={faRightToBracket}
                      color={"#0067a3"}
                    />
                  </button>
                  <button className={styles.captchaButton}>
                    <ReCAPTCHA
                      sitekey={recaptcha_sitekey}
                      onChange={handleRecaptchaChange}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={styles.ZeroLineMoM}
              style={{ justifyContent: "space-between" }}
            >
              <div className={styles.ZeroLine} style={{ width: "66%" }}>
                <div className={styles.ServerTitle}>{posts.title}</div>
                <div className={styles.ServerDs}>
                  {posts.description.split("\n").map((p, index) => {
                    if (p.match(regex)) {
                      p = p.match(regex)[0];
                      return (
                        <div className={styles.ServerDsImg} key={index}>
                          <img src={p} alt={p} />
                        </div>
                      );
                    }
                    return <p key={index}>{p}</p>;
                  })}
                </div>
              </div>
              <div
                className={styles.FirstLine}
                style={{
                  width: "308px",
                  justifyContent: "right",
                }}
              >
                <div className={styles.AdminBoxMom}>
                  <div className={styles.AdminsLabel}>
                    관리자 {posts.admins.length}명
                  </div>
                  <div className={styles.AdminBox}>
                    {posts.admins.map((admin, index) => (
                      <div className={styles.Admin} key={index}>
                        <div className={styles.AdminImage}>
                          <Image
                            src={admin.iconURL}
                            alt={admin.tag}
                            width={90}
                            height={90}
                          ></Image>
                        </div>
                        <div className={styles.AdminTag}>
                          {admin.owner == true && (
                            <span className={styles.OwnerSpan}>
                              <FontAwesomeIcon
                                icon={faCrown}
                                color={"#323338"}
                              />
                              &nbsp;
                            </span>
                          )}
                          <div className={styles.nameAndTag}>
                            <div className={styles.AdminTagName}>
                              {admin.tag.split("#")[0]}
                            </div>
                            <div className={styles.AdminTagNumber}>
                              {"#" + admin.tag.split("#")[1]}
                            </div>
                          </div>
                          {/* {admin.tag.split("#")[0]}{" "}
                          {"#" + admin.tag.split("#")[1]} */}
                          {/* {admin.tag} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.ZeroLineMoM}>
              <div
                className={styles.ZeroLine}
                style={{ width: "calc(100% - 42px)" }}
              >
                <div className={styles.RecommendRankLabel}>
                  <FontAwesomeIcon icon={faThumbsUp} color={"#fbceb1"} /> 추천
                  리더보드
                </div>
                <div className={styles.RecommendRank}>
                  {posts.recommand_users.map((user, index) => (
                    <div className={styles.Recommend_user} key={index}>
                      <div className={styles.Recommender_rank}>
                        {index + 1}위
                      </div>
                      <div className={styles.Recommender_img}>
                        <Image
                          src={user.iconURL}
                          alt={user.tag}
                          width={60}
                          height={60}
                        ></Image>
                      </div>
                      <div className={styles.Recommender_tag}>{user.tag}</div>
                      <div className={styles.Recommend_count}>
                        {user.count}번
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.ZeroLineMoM}>
              <div
                className={styles.ZeroLine}
                style={{ width: "calc(100% - 42px)" }}
              >
                <div className={styles.RecommendRankLabel}>
                  <FontAwesomeIcon icon={faCircleUp} color={"orange"} /> 범프
                  리더보드
                </div>
                <div className={styles.RecommendRank}>
                  {posts.bump_users.map((user, index) => (
                    <div className={styles.Recommend_user} key={index}>
                      <div className={styles.Recommender_rank}>
                        {index + 1}위
                      </div>
                      <div className={styles.Recommender_img}>
                        <Image
                          src={user.iconURL}
                          alt={user.tag}
                          width={60}
                          height={60}
                        ></Image>
                      </div>
                      <div className={styles.Recommender_tag}>{user.tag}</div>
                      <div className={styles.Recommend_count}>
                        {user.count}번
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 사전 렌더링
export const getServerSideProps = async (context) => {
  const id = context.params.id;

  if (!id) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }

  let add_server_req = await fetch(`${ApiBaseURL}/api/v1/guilds/loadGuild`, {
    method: "POST",
    body: JSON.stringify({
      serverid: `${id}`,
      mode: "long",
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

  add_server_req_json.guild.id = id;

  return {
    props: {
      posts: add_server_req_json.guild,
    },
  };
};
