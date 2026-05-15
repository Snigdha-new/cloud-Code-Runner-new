import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      username,
      password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      navigate("/editor");
    } else {
      alert(res.data.error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "40px",
          borderRadius: "15px",
          width: "350px",
          textAlign: "center",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ color: "white", marginBottom: "30px" }}>
          Login
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "12px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Login
        </button>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/signup")}
        >
          Don’t have an account?{" "}
          <span style={{ color: "#38bdf8" }}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;