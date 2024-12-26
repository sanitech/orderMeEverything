import React from "react";
import blockedAccount from "../assets/blockAccount.png";

const NotActiveAccount = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <img src={blockedAccount} alt="Inactive Account" className="w-1/2" />
      <h1 className="font-bold text-4xl">Account Inactive</h1>
      <p>Your account is inactive. We apologize for the inconvenience.</p>
      <p>
        Check your email for instructions to reactivate it. Don’t forget to look
        in your spam folder!
      </p>
      <p>If you need help, email our support team at support@example.com.</p>
      <p className="mt-4">
        Visit our{" "}
        <a href="/help" className="text-blue-500 underline">
          Help Center
        </a>{" "}
        for more info.
      </p>
    </div>
  );
};

export default NotActiveAccount;
