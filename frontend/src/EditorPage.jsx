import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditorPage() {
  const [code, setCode] = useState("print('Hello World')");
  const [output, setOutput] = useState("");
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  const runCode = async () => {
    setOutput("Running...");

    try {
      const res = await axios.post("http://localhost:5000/run", {
        code,
      });

      setOutput(res.data.output || res.data.error);

    } catch {
      setOutput("Server error");
    }
  };

  const saveCode = async () => {
    try {
      await axios.post(
        "http://localhost:5000/save",
        {
          name,
          code,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      alert("Project Saved");

    } catch {
      alert("Save failed");
    }
  };

  const loadProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/projects",
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      setProjects(res.data);

    } catch {
      alert("Failed to load projects");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #0f172a, #111827, #1e293b)",
        color: "white",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
          }}
        >
          ☁ Cloud Code Runner
        </h1>

        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: "250px",
            background: "rgba(255,255,255,0.05)",
            padding: "20px",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <h2>📁 My Projects</h2>

          <button
            onClick={loadProjects}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              marginBottom: "20px",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Load Projects
          </button>

          {projects.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setCode(p.code);
                setName(p.name);
              }}
              style={{
                padding: "10px",
                background: "rgba(255,255,255,0.08)",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              📄 {p.name}
            </div>
          ))}
        </div>

        {/* EDITOR + OUTPUT */}
        <div style={{ flex: 1 }}>
          {/* PROJECT INPUT */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <input
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
                background: "#1e293b",
                color: "white",
              }}
            />

            <button
              onClick={saveCode}
              style={{
                padding: "12px 20px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={runCode}
              style={{
                padding: "12px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ▶ Run
            </button>
          </div>

          {/* EDITOR */}
          <div
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              marginBottom: "20px",
              boxShadow: "0px 0px 20px rgba(0,0,0,0.4)",
            }}
          >
            <Editor
              height="500px"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
            />
          </div>

          {/* OUTPUT */}
          <div
            style={{
              background: "black",
              color: "#22c55e",
              padding: "20px",
              borderRadius: "15px",
              minHeight: "150px",
              fontSize: "16px",
              overflowX: "auto",
              boxShadow: "0px 0px 20px rgba(0,0,0,0.4)",
            }}
          >
            <h3 style={{ color: "white" }}>⚡ Output</h3>

            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;










// import { useState } from "react";
// import Editor from "@monaco-editor/react";
// import axios from "axios";

// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// function App() {
//   const [code, setCode] = useState("print('Hello World')");
//   const [output, setOutput] = useState("");
//   const [name, setName] = useState("");
//   const [projects, setProjects] = useState([]);

//   //new added
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   //add signup(new added)
//   const signup = async () => {
//     const res = await axios.post("http://localhost:5000/signup", {
//       username,
//       password,
//     });

//     alert(res.data.message || res.data.error);
//   };

//   //add login(new added)
//   const login = async () => {
//     const res = await axios.post("http://localhost:5000/login", {
//       username,
//       password,
//     });

//     if (res.data.token) {
//       localStorage.setItem("token", res.data.token);
//     }

//     alert(res.data.message || res.data.error);
//   };

//   //2new
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//         navigate("/");
//     }
//   }, []);

//   /* ================= RUN CODE ================= */
//   const runCode = async () => {
//     setOutput("Running...");

//     try {
//       const res = await axios.post("http://localhost:5000/run", {
//         code,
//       });

//       setOutput(res.data.output || res.data.error);
//     } catch {
//       setOutput("Server error");
//     }
//   };

//   /* ================= SAVE CODE ================= */
//   const saveCode = async () => {
//     if (!name) {
//       alert("Enter project name");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/save", {
//         name,
//         code},
//          {
//             headers: {
//             authorization: localStorage.getItem("token"),
//             },
//         }
//       );
//       alert("Saved!");
//       setName(""); // clear input
//     } catch {
//       alert("Save failed");
//     }
//   };

//   /* ================= LOAD PROJECTS ================= */
//   const loadProjects = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/projects",
//         {
//             headers: {
//             authorization: localStorage.getItem("token"),
//             },
//         }
//       );
//       console.log("Projects:", res.data); // debug
//       setProjects(res.data);
//     } catch {
//       alert("Load failed");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Cloud Code Runner</h1>

//       {/* new added */}
//       {/* <h2>Authentication</h2>
//       <input
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={signup}>Sign Up</button>
//       <button onClick={login}>Login</button> */}

//       {/* ================= EDITOR ================= */}
//       <Editor
//         height="300px"
//         defaultLanguage="python"
//         value={code}
//         onChange={(value) => setCode(value || "")}
//         theme="vs-dark"
//       />

//       {/* ================= INPUT ================= */}
//       <input
//         placeholder="Project name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         style={{ marginTop: "10px", padding: "5px" }}
//       />

//       {/* ================= BUTTONS ================= */}
//       <div style={{ marginTop: "10px" }}>
//         <button onClick={saveCode}>Save</button>
//         <button onClick={loadProjects} style={{ marginLeft: "10px" }}>
//           Load
//         </button>
//       </div>

//       {/* ================= PROJECT LIST ================= */}
//       <ul style={{ marginTop: "10px" }}>
//         {projects.map((p, i) => (
//           <li
//             key={i}
//             style={{ cursor: "pointer", margin: "5px 0" }}
//             onClick={() => setCode(p.code)}
//           >
//             {p.name || "Unnamed Project"}
//           </li>
//         ))}
//       </ul>

//       {/* ================= RUN BUTTON ================= */}
//       <button
//         onClick={runCode}
//         style={{
//           marginTop: "10px",
//           padding: "10px",
//           cursor: "pointer",
//         }}
//       >
//         Run Code
//       </button>

//       {/* ================= OUTPUT ================= */}
//       <pre
//         style={{
//           marginTop: "20px",
//           background: "black",
//           color: "lime",
//           padding: "10px",
//           minHeight: "100px",
//         }}
//       >
//         {output}
//       </pre>
//     </div>
//   );
// }

// export default App;
