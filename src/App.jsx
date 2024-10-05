import React, { useEffect } from "react";
import { Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { useDispatch } from "react-redux";
import { verifyStoredToken } from "./store/authSlice";

const LazyMainNav = React.lazy(() =>
  import("./containers/mainPage/mainNav/mainNav")
);

const LazyLoginForm = React.lazy(() =>
  import("./containers/mainPage/loginForm/loginForm")
);

const LazyDashboardNav = React.lazy(() =>
  import("./containers/dashboardPage/dashboardNav/dashboardNav")
);
const LazyDashboardWelcomePage = React.lazy(() =>
  import("./containers/dashboardPage/dashboardMainPage/dashboardWelcomePage")
);
const LazyDashboardTasksPage = React.lazy(() =>
  import("./containers/dashboardPage/dashboardTasksPage/dashboardTasksPage")
);
const LazyAvailableTasksPage = React.lazy(() =>
  import(
    "./containers/dashboardPage/dashboardAvailableTasks/dashboardAvailableTasksPage"
  )
);
const LazyCalendarPage = React.lazy(() =>
  import("./containers/dashboardPage/calendar/calendar")
);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(verifyStoredToken({ token }));
    }
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LazyMainNav />
            </Suspense>
          }
        >
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyLoginForm />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LazyDashboardNav />
            </Suspense>
          }
        >
          <Route
            path="/dashboard/welcome"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyDashboardWelcomePage />
              </Suspense>
            }
          />

          <Route
            path="/dashboard/tasks"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyDashboardTasksPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/availableTasks"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyAvailableTasksPage />
              </Suspense>
            }
          />

          <Route
            path="/dashboard/calendar"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyCalendarPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
