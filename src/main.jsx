import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
      <Toaster 
      position="bottom-right"
      toastOptions={{
       style:{
         background:"#000000",
        color:"#ffffff"
       },
      }}
      />
    </StrictMode>
  </BrowserRouter>
);
