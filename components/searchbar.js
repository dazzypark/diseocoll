import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/searchbar.module.css";
import Image from "next/image";

const SearchBar = ({ guilds, type }) => {
  const router = useRouter();
  const [text, setText] = useState("");
  const [prevText, setPrevText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (text === "") {
      setSearchResults([]);
      if (type == "guild") {
        const query = router.query;

        // 삭제하려는 파라미터의 이름을 알아내고, 이를 delete 연산자를 이용하여 제거합니다.
        delete query["search"];

        // 새로운 쿼리 파라미터를 URLSearchParams 객체로 만듭니다.
        const searchParams = new URLSearchParams(query).toString();

        if (searchParams == "") {
        } else {
          router.push(`/?${searchParams}`, undefined, { scroll: false });
        }

        // useRouter 훅을 이용하여 push 메서드를 호출하여 새로운 쿼리 파라미터를 적용합니다.
      } else {
        const query = router.query;

        // 삭제하려는 파라미터의 이름을 알아내고, 이를 delete 연산자를 이용하여 제거합니다.
        delete query["botsearch"];

        // 새로운 쿼리 파라미터를 URLSearchParams 객체로 만듭니다.
        const searchParams = new URLSearchParams(query).toString();

        // useRouter 훅을 이용하여 push 메서드를 호출하여 새로운 쿼리 파라미터를 적용합니다.
        if (searchParams == "") {
        } else {
          router.push(`/?${searchParams}`, undefined, { scroll: false });
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      if (text === prevText) {
        goSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    setSearchResults(guilds);
  }, [guilds]);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    if (inputText !== prevText) {
      setPrevText(inputText);
    }
  };

  const goSearch = () => {
    if (text == "") return;
    if (type == "guild") {
      router.push(
        {
          pathname: "/",
          query: Object.assign({}, router.query, { search: text }),
        },
        undefined,
        {
          scroll: false,
        }
      );
    } else {
      router.push(
        {
          pathname: "/",
          query: Object.assign({}, router.query, { botsearch: text }),
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
  };

  return (
    <>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={
            type == "bot"
              ? "봇 이름을 입력해 주세요"
              : "서버 이름을 입력해 주세요"
          }
          value={text}
          onChange={handleInputChange}
        />
        <button type="submit" onClick={goSearch}>
          검색
        </button>
      </div>
      <div className={styles.searchResults}>
        {searchResults?.map((result, index) => (
          <div key={index} className={styles.searchResult}>
            <div className={styles.searchResultIcon}>
              <Image
                src={result.iconURL}
                alt={`${result.name} 서버 아이콘`}
              ></Image>
            </div>
            <div className={styles.NameAndTitle}>
              <div className={styles.searchResultName}>{result.name}</div>
              <div className={styles.searchResultTitle}>{result.title}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchBar;
