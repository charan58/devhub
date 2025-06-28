import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './components/contexts/AuthProvider';
import { ToastContainer } from 'react-toastify';
import Welcome from './components/welcome/Welcome';
import Register from './components/register/Register';
import RootLayout from './components/RootLayout';
import ErrorElement from './components/ErrorElement';
import Home from './components/home/Home';
import Snippets from './components/snippets/Snippets';
import DailyLogs from './components/dailylogs/DailyLogs';
import Learning from './components/learning/Learning';
import Bookmarks from './components/bookmarks/Bookmarks';
import Tools from './components/tools/Tools';
import JwtDecoder from './components/tools/tabs/jwtdecoder/JwtDecoder';
import JsonFormatter from './components/tools/tabs/jsonformatter/JsonFormatter';
import RegexTester from './components/tools/tabs/regextester/RegexTester';
import CronTester from './components/tools/tabs/crontester/CronTester';
import ProtectedRoute from './components/routes/ProtectedRoute';

function App() {

  const routerObject = createBrowserRouter([
    {
      path: '/',
      element: <Welcome />,
      errorElement: <ErrorElement />
    },
    {
      path: '/register',
      element: <Register />,
      errorElement: <ErrorElement />
    },

    // after loggin in
    {
      path: '/app',
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorElement />,
      children: [
        { index: true, element: <Home /> },
        { path: 'snippets', element: <Snippets /> },
        { path: 'logs', element: <DailyLogs /> },
        { path: 'learnings', element: <Learning /> },
        { path: 'bookmarks', element: <Bookmarks /> },
        {
          path: 'tools',
          element: <Tools />,
          children: [
            { index: true, path: 'jwt-decoder', element: <JwtDecoder /> },
            { path: 'json-formatter', element: <JsonFormatter /> },
            { path: 'regex-tester', element: <RegexTester /> },
            { path: 'cron-tester', element: <CronTester /> },
          ],
        },
      ],
    }

  ])
  return (
    <AuthProvider>
      <RouterProvider router={routerObject} />
      <ToastContainer />
    </AuthProvider>

  )
}

export default App
