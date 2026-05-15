import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signup = async () => {
    const res = await axios.post("http://localhost:5000/signup", {
      username,
      password,
    });

    alert(res.data.message || res.data.error);

    if (res.data.message) {
      navigate("/");
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
          Signup
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
          onClick={signup}
          style={{
            width: "100%",
            padding: "12px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Signup
        </button>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "20px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Already have an account?{" "}
          <span style={{ color: "#38bdf8" }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;