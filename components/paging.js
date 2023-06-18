// emoji import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons";

// css import
import styles from "../styles/paging.module.css";
import Link from "next/link";
import { domain } from "@/settings";
import { useRouter } from "next/router";

export default function Paging({ NowPage, type }) {
  const router = useRouter();

  const getPageNumbers = (currentPage) => {
    const pageNumbers = [];
    let startNumber = currentPage - 4;
    let endNumber = currentPage + 4;

    if (startNumber < 1) {
      endNumber += 1 - startNumber;
      startNumber = 1;
    }

    const maxPageNumber = 50; // 최대 페이지 수
    if (endNumber > maxPageNumber) {
      startNumber -= endNumber - maxPageNumber;
      endNumber = maxPageNumber;
    }

    for (let i = startNumber; i <= endNumber; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers(NowPage);

  return (
    <div className={styles.Main}>
      <Link
        className={`${styles.BackFront} ${
          NowPage === 1 ? `${styles.selected}` : ""
        }`}
        scroll={false}
        href={
          type == "guild"
            ? {
                pathname: "/",
                query: { ...router.query, servers: `${(NowPage - 1) * 12}` },
              }
            : {
                pathname: "/",
                query: { ...router.query, bots: `${(NowPage - 1) * 12}` },
              }
        }
      >
        <FontAwesomeIcon icon={faLeftLong} />
      </Link>
      <div className={styles.Numbers}>
        {pageNumbers.map((number) => (
          <Link
            href={
              type == "guild"
                ? {
                    pathname: "/",
                    query: { ...router.query, servers: `${number * 12}` },
                  }
                : {
                    pathname: "/",
                    query: { ...router.query, bots: `${number * 12}` },
                  }
            }
            scroll={false}
            className={`${styles.Number} ${
              number === NowPage ? `${styles.selected}` : ""
            }`}
            key={number}
          >
            {number}
          </Link>
        ))}
      </div>
      <Link
        className={styles.BackFront}
        scroll={false}
        href={
          type == "guild"
            ? {
                pathname: "/",
                query: { ...router.query, servers: `${(NowPage + 1) * 12}` },
              }
            : {
                pathname: "/",
                query: { ...router.query, bots: `${(NowPage + 1) * 12}` },
              }
        }
      >
        <FontAwesomeIcon icon={faRightLong} />
      </Link>
    </div>
  );
}
