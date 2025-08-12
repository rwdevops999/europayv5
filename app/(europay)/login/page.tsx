import StartLogin from "./components/start-login";

const Login = () => {
  const renderComponent = () => {
    return <StartLogin doLogin={true} />;
  };

  return <>{renderComponent()}</>;
};

export default Login;
