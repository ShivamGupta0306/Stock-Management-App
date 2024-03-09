import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { UserRightsProvider } from "../src/Components/UserRightsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserRightsProvider>
  <BrowserRouter>
    <Toaster containerStyle={{zIndex:200000}}/>
    <App />
  </BrowserRouter>
  </UserRightsProvider>

);