import React from "react";
import { Suspense } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";

import LoadingState from "./components/loadingState/loadingState";

const LazyProtectedRoute = React.lazy(() =>
  import("./containers/protectedRoute/ProtectedRoute")
);

const LazyMainNav = React.lazy(() =>
  import("./containers/mainPage/mainNav/mainNav")
);

const LazyRegisterForm = React.lazy(() =>
  import("./containers/mainPage/registerForm/registerForm")
);

const LazyVerificationPage = React.lazy(() =>
  import("./containers/mainPage/verificationPage/verificationPage")
);

const LazyActivationPage = React.lazy(() =>
  import("./containers/mainPage/activationPage/activationPage")
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

//////////////////////////////////////////////////////////////////////////////////////////////

const LazyAdminUserManagementPage = React.lazy(() =>
  import(
    "./containers/adminPage/userManagementPage/userManagementPageMain/userManagementPageMain"
  )
);

function App() {
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
            path="/activateUser"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyActivationPage />
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
              <LazyProtectedRoute>
                <LazyDashboardNav />
              </LazyProtectedRoute>
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
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingState />}>
              <LazyProtectedRoute adminRoute={true}>
                <LazyDashboardNav showAdminNav={true} />
              </LazyProtectedRoute>
            </Suspense>
          }
        >
          <Route
            path="/admin/welcome"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyDashboardHomePage />
              </Suspense>
            }
          />
          <Route
            path="/admin/userManagement"
            element={
              <Suspense fallback={<LoadingState />}>
                <LazyAdminUserManagementPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
