import { useRouter } from 'next/navigation';
import MediaQuery from 'react-responsive';

export default function Header() {
  const router = useRouter();

  function handleNameClick() {
    router.push('/');
  }

  function handleAboutClick() {
    router.push('/about');
  }

  function handlePhotosClick() {
    router.push('/photos');
  }

  function handleContactClick() {
    router.push('/');
  }

  function handleSocialMediaClick(link: string) {
    window.open(link)
  }

  return (
    <div className=''>
        <div className="flex justify-between">
          <div className=''>
            <button className="lg:text-5xl md:text-3xl sm:text-3xl text-2xl mt-10 ml-10 font-medium hover:-translate-y-1 hover:scale-105 duration-300" onClick={handleNameClick}>
                Alan Ly
            </button>
            <p className='lg:text-xl md:text-l sm:text-md text-sm mx-10 font-medium text-gray-500 md:text-md'>CS @ the University of Washington</p>
          </div>
            {/* Mobile navbar */}
            <MediaQuery maxWidth={767}>
              <div className="lg:text-3xl sm:text-xl mt-10 mr-10 font-medium">
                  <ul className="flex-col text-right">
                      <li>
                      <button onClick={handleContactClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>Projects</button>
                      </li>
                      <li>
                      <button onClick={handlePhotosClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>Photos</button>
                      </li>
                      <li>
                      <button onClick={handleAboutClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>About</button>
                      </li>
                  </ul>
              </div>
            </MediaQuery>
            {/* Laptop or desktop navbar */}
            <MediaQuery minWidth={768}>
              <div className="lg:text-3xl sm:text-xl mt-10 mr-10 font-medium">
                  <ul className="flex flex-row space-x-8">
                      <li>
                      <button onClick={handleContactClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>Projects</button>
                      </li>
                      <li>
                      <button onClick={handlePhotosClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>Photos</button>
                      </li>
                      <li>
                      <button onClick={handleAboutClick} className='hover:-translate-y-1 hover:scale-105 duration-300'>About</button>
                      </li>
                  </ul>
              </div>
            </MediaQuery>
        </div>
        <div className="mt-5 lg:text-xl md:text-l sm:text-md text-sm font-medium text-gray-500 md:text-md text-center">
          <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-500"/>
          <button onClick={() => handleSocialMediaClick("http://instagram.com/alan.lyy")} className='mr-10 hover:-translate-y-1 hover:scale-105 duration-300'>Instagram</button>
          <button onClick={() => handleSocialMediaClick("http://linkedin.com/in/alananlan")} className='mr-10 hover:-translate-y-1 hover:scale-105 duration-300'>LinkedIn</button>
          <button onClick={() => handleSocialMediaClick("http://github.com/alananlan")} className='hover:-translate-y-1 hover:scale-105 duration-300'>GitHub</button>
          <hr className="h-px mt-6 bg-gray-200 border-0 dark:bg-gray-500"/>

        </div>
    </div>
  );
}