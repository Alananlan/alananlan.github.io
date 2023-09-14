import '../App.css';
// import UW from "../images/UW.png";
// import UW from "../../public/UW.png";
import { Greeting } from './Greeting';

export const Background:React.FC<{ orientation: string }> = (props) => {
    const { orientation } = props;
  return (
    <div className="App">
      <div className="image-container">
        <img
          src={"./UW.png"}
          alt="UW_BUILDING"
          className="responsive-image"
        />
        <Greeting orientation={orientation} />
      </div>
    </div>
  );
};
