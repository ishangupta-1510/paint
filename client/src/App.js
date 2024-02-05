import "./App.css";
import Home from "./components/homepage/Home";
import Login from "./components/login/login";
import Register from "./components/register/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
// 78gg
function App() {
  const [user, setLoginUser] = useState({});
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              user && user._id ? (
                <Home setLoginUser={setLoginUser} />
              ) : (
                <Login setLoginUser={setLoginUser} />
              )
            }
          />
          <Route
            path="/login"
            element={<Login setLoginUser={setLoginUser} />}
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
