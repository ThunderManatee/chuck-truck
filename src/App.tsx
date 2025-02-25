import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { store } from "./store";
import { theme } from "./styles/theme";
import { AuthProvider } from "./context/AuthContext";
import { OnboardingProvider } from "./context/OnboardingContext";

// Temporary placeholder components until we build the real ones
const Login = () => <div>Login Page</div>;
const Signup = () => <div>Signup Page</div>;
const Onboarding = () => <div>Onboarding Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const Jobs = () => <div>Jobs Page</div>;
const Providers = () => <div>Providers Page</div>;
const Billing = () => <div>Billing Page</div>;

const queryClient = new QueryClient();

function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <OnboardingProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected routes - we'll add auth guard later */}
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/jobs/*" element={<Jobs />} />
                  <Route path="/providers/*" element={<Providers />} />
                  <Route path="/billing/*" element={<Billing />} />

                  {/* Redirect root to dashboard or login based on auth status */}
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </Router>
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
