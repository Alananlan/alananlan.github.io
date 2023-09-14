import { useState, useEffect } from 'react';
import './App.css';
import { useMediaQuery } from 'react-responsive';
import { Background } from './components/Background'
import { Greeting } from './components/Greeting';
import { Navbar } from './components/Navbar';
import { About } from './components/About';
import { Socials } from './components/Socials';

const App = () => {
  const [orientation_prop, setOrientation] = useState("isDesktop");

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1224px)' });
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  useEffect( () => {
    if (isTabletOrMobile) {
      setOrientation("isTabletOrMobile");
    } else if (isDesktop) {
      setOrientation("isDesktop");
    } else if (isBigScreen) {
      setOrientation("isBigScreen");
    }
  });

  return (
    <div className="App">
      <Navbar />
      <Socials />
        <Background orientation={orientation_prop}/>
        <div className="second-background">
            {/* <About /> */}
        </div>
    </div>
  );
}

export default App;

