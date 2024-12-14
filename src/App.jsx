import React, { useEffect } from "react";
import { Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  setTokenVerificationComplete,
  verifyStoredToken,
} from "./store/authSlice";

import LoadingState from "./components/loadingState/loadingState";

const LazyMainNav = React.lazy(() =>
  import("./containers/mainPage/mainNav/mainNav")
);

const LazyRegisterForm = React.lazy(() =>
  import("./containers/mainPage/registerForm/registerForm")
);

const LazyVerificationPage = React.lazy(() =>
  import("./containers/mainPage/verificationPage/verificationPage")
);

const LazyLoginForm = React.lazy(() =>
  import("./containers/mainPage/loginForm/loginForm")
);

const LazyDashboardNav = React.lazy(() =>
  import("./containers/dashboardPage/dashboardNav/dashboardNav")
);
const LazyDashboardHomePage = React.lazy(() =>
  import("./containers/dashboardPage/homePage/homePageMain/homePageMain")
);
const LazyUserTasksPage = React.lazy(() =>
  import(
    "./containers/dashboardPage/userTasksPage/userTasksPageMain/userTasksPageMain"
  )
);
const LazyAvailableTasksPage = React.lazy(() =>
  import(
    "./containers/dashboardPage/availableTasksPage/availableTasksMain/availableTasksMain"
  )
);
const LazyCompletedUserTasksPage = React.lazy(() =>
  import(
    "./containers/dashboardPage/completedUserTasksPage/completedUserTasksMain/completedUserTasksMain"
  )
);

const LazyFullCalendarPage = React.lazy(() =>
  import("./containers/dashboardPage/fullCalendarPage/fullCalendarPage")
);

function App() {
  const dispatch = useDispatch();
  //veryfing token here saves a lot of trouble
  //and keeps the code dry
  //leave it be
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      dispatch(verifyStoredToken({ token }));
    } else dispatch(setTokenVerificationComplete());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingState />}>
              <LazyMainNav />
            </Suspense>
          }
        >
          <Route
            path="/register"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyRegisterForm />
              </Suspense>
            }
          />
          <Route
            path="/verifyUser"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyVerificationPage />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyLoginForm />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingState fullscreen={true} />}>
              <LazyDashboardNav />
            </Suspense>
          }
        >
          <Route
            path="/dashboard/welcome"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyDashboardHomePage />
              </Suspense>
            }
          />

          <Route
            path="/dashboard/tasks"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyUserTasksPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/availableTasks"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyAvailableTasksPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/completedTasks"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyCompletedUserTasksPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/calendar"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyFullCalendarPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
