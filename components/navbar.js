// 모듈 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import Link from "next/link";

// css import
import NavBarstyles from "../styles/navbar.module.css";

// config import
import { domain, oauth2URL } from "@/settings";

export default function Home(props) {
  // 렌더링 변수들
  let [userProfile, userProfileEd] = useState(
    "https://media.discordapp.net/attachments/1078929528400924722/1079723185852919808/826698986970677278.jpg"
  );
  let [user, userEd] = useState({ tag: "알로항#4559", username: "알로항" });
  let [loginTF, loginTFEd] = useState(false);
  let [userid, setuserid] = useState("");

  const SelectMenuTF = props.SelectMenuTF;
  const SelectMenuTFEd = props.SelectMenuTFEd;

  // 쿠키들
  const [Cookie, setCookie, removeCookie] = useCookies([
    "token",
    "access_token",
  ]);

  // 웹사이트 로딩 후 한번만 실행
  useEffect(() => {
    // 쿠키 확인하고 자동 로그인
    async function checkCookie() {
      if (!Cookie.access_token || !Cookie.token) return;
      if (Cookie.access_token) {
        const userResponseData = await fetch(
          "https://discord.com/api/users/@me",
          {
            headers: {
              Authorization: `Bearer ${Cookie.access_token}`,
            },
          }
        );

        const userData = await userResponseData.json(); //이거

        if (userResponseData.status != 200) {
          window.location.href = `${domain}/api/login`;
        }

        if (userData.code != 0) {
          let UserImageURL;
          if (!userData.avatar) {
            UserImageURL = `https://cdn.discordapp.com/embed/avatars/${
              userData.discriminator % 5
            }.png`;
          } else {
            UserImageURL = `https://cdn.discordapp.com/avatars/${userData.id}/${
              userData.avatar
            }.${userData.avatar.startsWith("a_") ? "gif" : "png"}?size=4096`;
          }
          loginTFEd(true);
          userProfileEd(UserImageURL);
          setuserid(userData.id);
          userEd({
            tag: `${userData.username}#${userData.discriminator}`,
            username: `${userData.username}`,
          });
        }

        return;
      }
    }
    checkCookie();
  }, []);

  // 로그아웃 함수
  async function logOut() {
    removeCookie("token");
    removeCookie("access_token");
    window.location.href = domain;
  }

  return (
    <>
      <div className={NavBarstyles.navbar}>
        {/* 나브바 타이틀 */}
        <Link className={NavBarstyles.webTitle} href={"/"}>
          DISEOCOLL
        </Link>

        {/* 나브바 링크들 (PC) */}
        {props.links == "true" && (
          <ul className={NavBarstyles.navLL}>
            <li>
              <Link href={"/about"}>소개</Link>
            </li>
            <li>
              <Link href={"/fetchnote"}>패치노트</Link>
            </li>
            <li>
              <Link href={"/addServer"}>서버 등록</Link>
            </li>
            <li>
              <Link href={"/addBot"}>봇 등록</Link>
            </li>
          </ul>
        )}

        {/* 로그인 버튼 || 프로필 버튼 */}
        <div className={NavBarstyles.ButtonDiv}>
          {loginTF == true && (
            <div
              className={NavBarstyles.loginSucess}
              onClick={() => {
                SelectMenuTFEd((f) => !f);
              }}
            >
              {" "}
              <Image
                src={userProfile}
                alt={`${user.tag}님의 프로필`}
                width={40}
                height={40}
              ></Image>{" "}
              <div className={NavBarstyles.Username}>
                {user.username.length > 5
                  ? `${user.username.substr(0, 5)}...`
                  : user.username}
              </div>
            </div>
          )}
          {loginTF == false && (
            <button
              className={NavBarstyles.loginBtn}
              onClick={() => {
                window.location = `${oauth2URL}`;
              }}
            >
              로그인
            </button>
          )}
        </div>

        {/* 프로필 클릭 시 나오는 설렉트 메뉴 */}
        {SelectMenuTF == true && (
          <div className={NavBarstyles.SelectMenu}>
            <Link
              className={NavBarstyles.LogOut}
              style={{ textDecoration: "none" }}
              href={{ pathname: "/MyProject/[id]", query: { id: userid } }}
            >
              <div className={NavBarstyles.MyPencilLabel}>
                <FontAwesomeIcon icon={faPencil} />
                &nbsp;내 작품
              </div>
            </Link>
            <hr />
            <div className={NavBarstyles.LogOut} onClick={logOut}>
              <div className={NavBarstyles.LogOutLabel} id="LogOutLabelred">
                <FontAwesomeIcon icon={faRightFromBracket} />
                &nbsp;로그아웃
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 나브바 링크 (MOBILE) */}
      {props.links == "true" && (
        <div className={NavBarstyles.navbarLinksMobile}>
          <li>
            <Link href={"/about"}>소개</Link>
          </li>
          <li>
            <Link href={"/fetchnote"}>패치노트</Link>
          </li>
          <li>
            <Link href={"/addServer"}>서버 등록</Link>
          </li>
          <li>
            <Link href={"/addBot"}>봇 등록</Link>
          </li>
        </div>
      )}
    </>
  );
}
