import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <>
      <header>
        <img src="rmutl_logo.png" alt="" className="h-full" />
        <ul className="flex space-x-10 font-medium">
          <li><a href="/">HOME</a></li>
          <li><a href="about">ABOUT</a></li>
          <li><a href="selling">SELLING</a></li>
        </ul>
        <button className="border-2 rounded-md px-4 py-2">
          <p>LOGIN</p>
          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-auto"/>
        </button>
      </header>
    </>
  );
}
