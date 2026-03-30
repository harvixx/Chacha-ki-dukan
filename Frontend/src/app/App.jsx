import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "../features/home/components/Toast";

function App() {
  return (
    <div className="dark min-h-screen">
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </div>
  );
}

export default App;