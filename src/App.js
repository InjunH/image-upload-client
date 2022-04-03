import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ImagePage from "./pages/ImagePage";
import RegisgerPage from "./pages/RegisterPage";
import { Switch, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ToolBar></ToolBar>
      <Switch>
        <Route path="/images/:imageId" exact component={ImagePage}></Route>
        <Route path="/auth/register" exact component={RegisgerPage}></Route>
        <Route path="/auth/login" exact component={LoginPage}></Route>
        <Route path="/" component={MainPage}></Route>
      </Switch>
    </div>
  );
};

export default App;
