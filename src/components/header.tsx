import { useRouter } from 'next/navigation';

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
            <button className="lg:text-5xl md:text-2xl mt-10 ml-10 font-medium hover:-translate-y-1 hover:scale-105 duration-300" onClick={handleNameClick}>
                Alan Ly
            </button>
            <div className="lg:text-3xl sm:text-xl mt-10 mr-10 font-medium">
                <ul className="flex row space-x-8">
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
        </div>
        <div className="mx-10 font-medium text-gray-500 lg:text-xl md:text-md">
            <p>CS @ the University of Washington</p>
            <button onClick={() => handleSocialMediaClick("http://instagram.com/alan.lyy")} className='mr-10 hover:-translate-y-1 hover:scale-105 duration-300'>Instagram</button>
            <button onClick={() => handleSocialMediaClick("http://linkedin.com/in/alananlan")} className='mr-10 hover:-translate-y-1 hover:scale-105 duration-300'>LinkedIn</button>
            <button onClick={() => handleSocialMediaClick("http://github.com/alananlan")} className='mr-10 hover:-translate-y-1 hover:scale-105 duration-300'>GitHub</button>
        </div>
    </div>
  );
}