import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ImageProvider } from "./context/ImageContext";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ImageProvider>
          {/* 하위에 있는 모든 컴포넌트들이 값 접근 해진다. */}
          <App />
        </ImageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
