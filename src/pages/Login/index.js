import { useState } from "react";
import LoadableComponent from "@/utils/LoadableComponent";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import bg from "@/assets/images/bg.jpg";
import "./style.less";

const Background = LoadableComponent(import("@/components/Background"));

function Login() {
  const [show, setShow] = useState("login");

  const toggleShow = () => {
    setShow((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <Background url={bg}>
      <div className="login-container">
        <div className={`box ${show === "login" ? "active" : ""}`}>
          <LoginForm toggleShow={toggleShow} />
        </div>
        <div className={`box ${show === "register" ? "active" : ""}`}>
          <RegisterForm toggleShow={toggleShow} />
        </div>
      </div>
    </Background>
  );
}

export default Login;
