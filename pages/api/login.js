const clientId = "1094190720740511854"; // your clientID
const redirect_uri = `${domain}/api/login`; // your domain

import { serialize } from "cookie";
import { domain } from "@/settings";

export default async function handler(req, res) {
  let code = req.query.code;
  if (code) {
    try {
      const data = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
        scopre: "identify guilds guilds.join",
      });
      const tokenResponseData = await fetch(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const oauthData = await tokenResponseData.json(); //이거

      if (oauthData.error === "invalid_grant") {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("오류가 발생했어요 서포트 서버로 문의해 주세요");
      }

      if (tokenResponseData.status !== 200) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("오류가 발생했어요 서포트 서버로 문의해 주세요");
      }

      res.setHeader("Set-Cookie", [
        serialize(`token`, oauthData.refresh_token, {
          path: "/",
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
        }),
        serialize(`access_token`, oauthData.access_token, {
          path: "/",
          expires: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
        }),
      ]);
    } catch (error) {
      console.error(error);
    }
  } else {
    const refresh_token = req.cookies?.token;

    if (!refresh_token) {
      res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("오류가 발생했어요 서포트 서버로 문의해 주세요");
    }

    // 리프레시 오셨어요!
    const refresh_fetch = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
    });

    const refresh_fetch_json = await refresh_fetch.json();

    if (refresh_fetch.status != 200) {
      //쿠키 삭제

      res.setHeader("Set-Cookie", [
        serialize(`token`, "", {
          path: "/",
          maxAge: -1,
        }),
        serialize(`access_token`, "", {
          path: "/",
          maxAge: -1,
        }),
      ]);

      res.redirect("/");
      return;
    }

    res.setHeader("Set-Cookie", [
      serialize(`token`, refresh_fetch_json.refresh_token, {
        path: "/",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      }),
      serialize(`access_token`, refresh_fetch_json.access_token, {
        path: "/",
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      }),
    ]);
  }
  res.redirect("/");
  return;
}
