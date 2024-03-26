import { ENV } from "_constants/environment";
import ErrorBoundary from "components/error/ErrorBoundary";
import { AppProviders, ThemeContextProvider } from "components/providers";
import Moralis from "moralis";
import { useEffect } from "react";
import AppRoutes from "routes";
function App() {
  useEffect(() => {
    const initMoralis = async () => {
      await Moralis.start({
        apiKey: ENV.MORALIS_API_KEY,
      });
    };
    initMoralis();
  });
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </ThemeContextProvider>
    </ErrorBoundary>
  );
}

export default App;
