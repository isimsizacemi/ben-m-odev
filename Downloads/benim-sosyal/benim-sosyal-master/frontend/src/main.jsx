import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient oluşturulur
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

// ReactDOM.createRoot() ile uygulamanın rootunu render et
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* BrowserRouter kullanarak React Router'ı etkinleştir */}
        <BrowserRouter>
            {/* QueryClientProvider ile QueryClient'i sağla */}
            <QueryClientProvider client={queryClient}>
                {/* Uygulama bileşenini render et */}
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
