import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

let fires = [];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default async function create() {
  for (let i = 0; i < fires.length; i++) {
    fires[i].close();
  }

  await sleep(500);

  const MySwalf = withReactContent(Swal);

  const Toastf = MySwalf.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", MySwalf.stopTimer);
      toast.addEventListener("mouseleave", MySwalf.resumeTimer);
      const closeToast = (event) => {
        if (!event.target.closest(".swal2-toast-container")) {
          Toastf.close();
        }
      };
      document.addEventListener("click", closeToast);
      // 이벤트 핸들러를 변수로 저장
      Toastf.closeToast = closeToast;
    },
    didClose: (toast) => {
      document.removeEventListener("click", Toastf.closeToast); // 저장한 이벤트 핸들러 변수 사용
    },
  });

  fires.push(Toastf);

  return Toastf;
}
