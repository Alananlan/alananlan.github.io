export default function Footer() {

  function handleSocialMediaClick(link: string) {
    window.open(link);
  }

  return (
    <div className="mt-5 pb-5 lg:text-xl md:text-l sm:text-md text-sm font-medium md:text-md text-center opacity-50">
      <hr className=" my-3 bg-gray-200 border-0 dark:bg-gray-500" />
      <button
        onClick={() => handleSocialMediaClick("http://instagram.com/alan.lyy")}
        className="mr-10 hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
      >
        Instagram
      </button>
      <button
        onClick={() =>
          handleSocialMediaClick("http://linkedin.com/in/alananlan")
        }
        className="mr-10 hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
      >
        LinkedIn
      </button>
      <button
        onClick={() => handleSocialMediaClick("http://github.com/alananlan")}
        className="hover:-translate-y-1 hover:scale-105 duration-300 hover:underline"
      >
        GitHub
      </button>
    </div>
  );
}
