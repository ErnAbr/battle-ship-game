import "./App.scss";
import { Routes } from "./navigation/routes/router.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes />;
      <ToastContainer closeOnClick position="bottom-right" theme="colored" />
    </>
  );
}

export default App;
