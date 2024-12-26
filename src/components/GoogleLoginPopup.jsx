import React, { useEffect } from "react";

const GoogleLoginPopup = () => {
  useEffect(() => {
    const CLIENT_ID =
      "307458584787-bgf9frefdu5o1ml5cdpeal54823u4jn4.apps.googleusercontent.com"; // Replace with your actual Client ID

    // Initialize the Google API
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false, // Prevents auto login and displays the account picker popup
    });
    // showPopup();
  }, []);

  // Callback function to handle the login response
  const handleCredentialResponse = (response) => {
    const idToken = response.credential;
    console.log("Google ID Token:", idToken);

    // Send the token to your backend for further processing
    fetch("/api/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Login Success:", data))
      .catch((err) => console.error("Error:", err));
  };

  // Show the popup
  const showPopup = () => {
    window.google.accounts.id.prompt();
  };

  return (
    <div>
      {/* <button
        onClick={showPopup}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Login with Google
      </button> */}
    </div>
  );
};

export default GoogleLoginPopup;
