import { useRouter } from "next/navigation";
import MediaQuery from "react-responsive";

export default function Header() {
  const router = useRouter();

  function handleNameClick() {
    router.push("/");
  }

  function handleAboutClick() {
    router.push("/about");
  }

  function handlePhotosClick() {
    router.push("/photos");
  }

  function handleResumeClick() {
    window.open(
      "https://drive.google.com/file/d/1hyO-ZTnFl_y_P9t5cHYGIfukuJ9RJrtn/view?usp=drive_link",
      "_blank",
    );
  }

  function handleContactClick() {
    router.push("/");
  }

  const MobileView = () => {
    return (
      <div className="lg:text-3xl sm:text-xl mt-10 mr-10 font-medium">
        <ul className="flex-col text-right">
          <li>
            <button
              onClick={handlePhotosClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300"
            >
              Photos
            </button>
          </li>
          <li>
            <button
              onClick={handleAboutClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={handleResumeClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300"
            >
              Resume
            </button>
          </li>
        </ul>
      </div>
    );
  };

  const DesktopView = () => {
    return (
      <div className="lg:text-3xl sm:text-xl mt-10 mr-10 font-medium">
        <ul className="flex flex-row space-x-8">
          <li>
            <button
              onClick={handlePhotosClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
            >
              Photos
            </button>
          </li>
          <li>
            <button
              onClick={handleAboutClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={handleResumeClick}
              className="hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
            >
              Resume
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <button
            className="lg:text-5xl md:text-3xl sm:text-3xl text-2xl mt-10 ml-10 font-medium text-left hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
            onClick={handleNameClick}
          >
            Alan Ly
          </button>
          <a
            className="text-left lg:text-xl md:text-l sm:text-md text-sm mx-10 font-medium md:text-md hover:underline"
            href="https://www.cs.washington.edu/"
            target="blank"
          >
            CS @ the University of Washington
          </a>
        </div>
        <MediaQuery maxWidth={767}>
          <MobileView></MobileView>
        </MediaQuery>

        <MediaQuery minWidth={768}>
          <DesktopView></DesktopView>
        </MediaQuery>
      </div>
    </div>
  );
}
