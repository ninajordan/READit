import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <button
        type="button"
        className="footer__tab"
        onClick={() => navigate("/channels")}
      >
        Channels
      </button>
      <button
        type="button"
        className="footer__tab"
        onClick={() => navigate("/create")}
      >
        Create
      </button>
      <button
        type="button"
        className="footer__tab"
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
    </footer>
  );
}
