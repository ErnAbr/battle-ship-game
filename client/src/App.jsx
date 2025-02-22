import "./App.scss";
import { Routes } from "./navigation/routes/router.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useAppStore } from "./context/store.js";
import { useEffect } from "react";
import { LoadingComponent } from "./components/LoadingComponent/LoadingComponent.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <LoadingComponent text="loading app..." />;
  }

  return (
    <>
      <Routes />
      <ToastContainer closeOnClick position="bottom-right" theme="colored" />
    </>
  );
}

export default App;
