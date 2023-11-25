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

  const MobileView = () => {
    return (
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
    )
  }

  const DesktopView = () => {
    return (
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
    )
  }

  return (
    <div className=''>
        <div className="flex justify-between">
          <div className=''>
            <button className="lg:text-5xl md:text-3xl sm:text-3xl text-2xl mt-10 ml-10 font-medium hover:-translate-y-1 hover:scale-105 duration-300" onClick={handleNameClick}>
                Alan Ly
            </button>
            <p className='lg:text-xl md:text-l sm:text-md text-sm mx-10 font-medium md:text-md'>CS @ the University of Washington</p>
          </div>
            {/* Mobile navbar */}
            <MediaQuery maxWidth={767}>
              <MobileView></MobileView>
            </MediaQuery>

            {/* Laptop or desktop navbar */}
            <MediaQuery minWidth={768}>
              <DesktopView></DesktopView>
            </MediaQuery>
        </div>
    </div>
  );
}