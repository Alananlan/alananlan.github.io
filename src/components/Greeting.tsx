// import pfp from '../images/pfp.png';
// import pfp from './images/pfp 2.jpg';
import '../App.css';
import { TypeAnimation } from 'react-type-animation';
import { useState, useEffect } from 'react';

export const Greeting: React.FC<{ orientation: string }> = (props) => {
    const { orientation } = props;

    const [avatarWidth, setAvatarWidth] = useState(400);
    const [avatarHeight, setAvatarHeight] = useState(400);

  return (
      <div className="center-container">
        <img src={"./pfp 2.png"} className='profile-image' alt="pfp" style={{}}/>
        <div style={{}}>
            <TypeAnimation className='greeting-text'
                sequence={[
                    "Hi, my name is Alan.",
                    4000,
                    "",
                    1000,
                    "Welcome to my page.",
                    4000,
                ]}
                speed={25}
                repeat={Infinity}
                wrapper="div"
                style={{}}
                />
            <h2 className="caption-text-0">
            I'm a Computer Science undergrad at the University of Washington.
            </h2>
        </div>
      </div>
  );
}
