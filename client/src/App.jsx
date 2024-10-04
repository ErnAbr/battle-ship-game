import "./App.scss";
import { Routes } from "./navigation/routes/router.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppInitializer } from "./utils/AppInitializer.jsx";

function App() {
  return (
    <AppInitializer>
      <Routes />;
      <ToastContainer closeOnClick position="bottom-right" theme="colored" />
    </AppInitializer>
  );
}

export default App;
