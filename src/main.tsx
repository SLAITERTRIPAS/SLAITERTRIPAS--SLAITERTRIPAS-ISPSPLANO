import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { ErrorBoundary } from "./App.tsx";
import "./index.css";

// Interceptor global para impedir que avisos de conexão/offline, chunk loading, ResizeObserver e asserções internas
// poluam a consola ou disparem erros fatais no ambiente da aplicação
if (typeof window !== "undefined") {
  const isIgnorableError = (msg: any) => {
    const m = String(msg?.message || msg?.stack || msg?.reason || msg || "").toLowerCase();
    return (
      m.includes("@firebase/firestore") ||
      m.includes("could not reach cloud firestore backend") ||
      m.includes("backend didn't respond within 10 seconds") ||
      m.includes("backend didn't respond") ||
      m.includes("internal assertion failed") ||
      m.includes("unexpected state") ||
      m.includes("client will operate in offline mode") ||
      m.includes("quota limit exceeded") ||
      m.includes("free daily read units") ||
      m.includes("resource-exhausted") ||
      m.includes("resource_exhausted") ||
      m.includes("quota exceeded") ||
      m.includes("resizeobserver loop completed with undelivered notifications") ||
      m.includes("resizeobserver loop limit exceeded") ||
      m.includes("dynamically imported module") ||
      m.includes("failed to fetch dynamically imported module") ||
      m.includes("loading chunk") ||
      m.includes("firestore (11.")
    );
  };

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (args.some((arg) => isIgnorableError(arg))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (args.some((arg) => isIgnorableError(arg))) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  const handleGlobalError = (event: ErrorEvent | any) => {
    const msg = event?.message || String(event?.error?.message || event?.error || "");
    if (isIgnorableError(msg) || isIgnorableError(event?.error)) {
      if (typeof event.preventDefault === "function") event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      return true;
    }
  };

  window.addEventListener("error", handleGlobalError, true);
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    const msg = reason?.message || String(reason || "");
    if (isIgnorableError(msg) || isIgnorableError(reason)) {
      if (typeof event.preventDefault === "function") event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    }
  }, true);

  window.onerror = (message, source, lineno, colno, error) => {
    if (isIgnorableError(message) || isIgnorableError(error)) {
      return true;
    }
  };
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

