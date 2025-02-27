import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./components/providers/AuthProvider.tsx";
import { QueryProvider } from "./components/providers/QueryProvider.tsx";
import ErrorBoundary from "./components/providers/ErrorBoundary.tsx";
import App from "./App.tsx";
import "./index.css";
import ResponsiveToastContainer from "./components/providers/ResposiveToastContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <ErrorBoundary>
          <ResponsiveToastContainer />
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);
