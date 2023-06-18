import { useEffect } from "react";
import Router from "next/router";

const Redirect = () => {
  useEffect(() => {
    // 리다이렉트할 URL을 설정합니다.
    const redirectUrl = "https://discord.gg/TrPauBe6Ye";
    Router.push(redirectUrl); // Router.push() 메서드를 사용하여 리다이렉트합니다.
  }, []);

  return null; // 페이지를 렌더링하지 않으므로 null을 반환합니다.
};

export default Redirect;
