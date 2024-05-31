import React, { useState } from "react";
import CCTech from "../../images/CCTech.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const handleLogin: () => Promise<void> = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("Login successful!");
      } else {
        setError("Incorrect email or password");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  
    // try {
    //   // Make the request using axios
    //   const response = await axios.post("/api/other-api", {
    //     email,
    //     password,
    //   });
      
    //   // Process the response
    //   console.log(response.data);

    //   // Check if login was successful based on the response
    //   if (response.data.success) {
    //     alert("Login successful!");
    //   } else {
    //     setError("Incorrect email or password");
    //   }
    // } catch (error) {
    //   console.error("Error submitting data:", error);
    // }
  // };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <img
        src={CCTech}
        alt="CCTech Logo"
        className="mb-8"
        style={{ width: "150px", height: "auto" }}
      />
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-64 mb-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="w-64 mb-4">
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="w-64 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
