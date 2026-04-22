import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/app/providers/theme-provider/theme-provider";
import { router } from "@/app/routes/router";
import "@/index.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
