import React from "react";

const LoginCredential = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <div className="grid sm:grid-cols-12 gap-2 sm:gap-12 bg-white rounded-lg p-4 shadow-sm">
      {/* Username Field */}
      <div className="sm:col-span-3">
        <label
          htmlFor="username"
          className="inline-block text-sm text-gray-800 mt-2.5"
        >
          Username
        </label>
      </div>
      <div className="sm:col-span-9">
        <input
          id="username"
          type="text"
          className="py-2 px-3 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email Field */}
      <div className="sm:col-span-3">
        <label
          htmlFor="email"
          className="inline-block text-sm text-gray-800 mt-2.5"
        >
          Email
        </label>
      </div>
      <div className="sm:col-span-9">
        <input
          id="email"
          type="email"
          className="py-2 px-3 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password Field */}
      <div className="sm:col-span-3">
        <label
          htmlFor="password"
          className="inline-block text-sm text-gray-800 mt-2.5"
        >
          Password
        </label>
      </div>
      <div className="sm:col-span-9">
        <input
          id="password"
          type="password"
          className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Confirm Password Field */}
      <div className="sm:col-span-3">
        <label
          htmlFor="confirm-password"
          className="inline-block text-sm text-gray-800 mt-2.5"
        >
          Confirm Password
        </label>
      </div>
      <div className="sm:col-span-9">
        <input
          id="confirm-password"
          type="password"
          className="py-2 px-3 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default LoginCredential;
