import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import PasswordChange from "./profile/PasswordChange";
const BusinessProfilePage = () => {
  const [vendor, setVendor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("userData") || "{}");

  const [logoPreview, setLogoPreview] = useState(
    "https://preline.co/assets/img/160x160/img1.jpg"
  );
  useEffect(() => {
    const fetchMyProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/v1/vendor/${user.vendor_id}`);
        console.log(response.data);
        setVendor(response.data);
        setError(""); // Clear any existing errors on successful fetch
      } catch (error) {
        setError("Error fetching menu items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProfile();
  }, []);
  return (
    <div className=" mx-auto">
      <div className="bg-white rounded-xl shadow ">
        <div className="pt-5 p-4 sm:pt-5 sm:p-7">
          <h1 className="font-bold text-gray-900 text-lg">Profile</h1>
          <p className="text-gray-700 mt-1">
            Manage your name, password and account settings.
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-5 w-2/3 mt-5">
            <div className="sm:col-span-2">
              <label className="inline-block text-sm font-medium text-gray-700 mt-2.5">
                Business Logo
              </label>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-3 max-w-sm">
              <div className="flex items-center gap-5">
                <img
                  className="inline-block size-16 rounded-full ring-2 ring-white object-cover"
                  src={
                    vendor.vendor_logo
                      ? process.env.REACT_APP_IMAGE_URL + vendor.vendor_logo
                      : logoPreview
                  }
                  alt={vendor.vendor_name}
                />
                <div className="flex gap-x-2">
                  <div>
                    <button type="button">
                      <label
                        htmlFor="af-submit-app-upload-logo"
                        className="py-2 px-3 inline-flex  items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-100 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent "
                      >
                        <input
                          id="af-submit-app-upload-logo"
                          name="af-submit-app-upload-logo"
                          type="file"
                          className="sr-only"
                        />
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Upload Logo
                      </label>
                    </button>
                    <button type="button">
                      <label className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-light rounded-lg border ml-3 border-gray-100 border-solid bg-white text-red-800 shadow-sm  hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50">
                        Delete
                      </label>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className=" w-full border-gray-200 my-5" />

          <h1 className="font-medium text-gray-900 text-base mb-3">
            Personal info
          </h1>

          <div className="grid grid-cols-5 gap-2 sm:gap-5 w-2/3">
            <div className="col-span-2">
              <label
                htmlFor="af-account-email"
                className="inline-block text-sm text-gray-800 mt-2.5 "
              >
                Business Name
              </label>
              <div className="hs-tooltip inline-block">
                <svg
                  className="hs-tooltip-toggle ms-1 inline-block size-3 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                <span
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                  role="tooltip"
                >
                  Displayed on public forums, such as Preline
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <input
                id="af-account-email"
                type="text"
                className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm text-sm rounded-lg focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Hotel and Resonant"
                value={vendor.vendor_name}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="af-submit-app-category"
                className="inline-block text-sm text-gray-800 mt-2.5 "
              >
                Business Type
              </label>
              <div className="hs-tooltip inline-block">
                <svg
                  className="hs-tooltip-toggle ms-1 border inline-block size-3 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1  2 0z" />
                </svg>
                <span
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                  role="tooltip"
                >
                  Displayed on public forums, such as Preline
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <input
                id="af-account-full-name"
                type="text"
                className="py-2 px-3 pe-11 block w-full border disabled:bg-transparent border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Maria"
                disabled
                value={vendor.vendor_type}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="af-account-full-name"
                className="inline-block text-sm text-gray-800 mt-2.5 "
              >
                Owner’s Name
              </label>
              <div className="hs-tooltip inline-block">
                <svg
                  className="hs-tooltip-toggle ms-1 inline-block size-3 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                <span
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                  role="tooltip"
                >
                  Displayed on public forums, such as Preline
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <div className="sm:flex">
                <input
                  id="af-account-full-name"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                  placeholder="Maria"
                />
                <input
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                  placeholder="Boone"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label
                htmlFor="af-account-email"
                className="inline-block text-sm text-gray-800 mt-2.5 "
              >
                Email address
              </label>
            </div>

            <div className="col-span-3">
              <input
                id="af-account-email"
                type="text"
                className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm text-sm rounded-lg focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Enter Email address"
                value={vendor.vendor_email}
              />
            </div>

            {/* <div className="col-span-2">
              <label
                htmlFor="af-account-email"
                className="inline-block text-sm text-gray-800 mt-2.5 "
              >
                Tin Number{" "}
              </label>
            </div>

            <div className="col-span-3">
              <input
                id="af-account-email"
                type="text"
                className="py-2 px-3 pe-11 block w-full border border-gray-200 shadow-sm text-sm rounded-lg focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Enter Tin number"
                value={vendor.tin_number}
              />
            </div> */}

            {/* description */}
            <div className="col-span-2">
              <label
                htmlFor="af-account-bio"
                className="inline-block text-sm text-gray-800 mt -2.5 "
              >
                Description
              </label>
              <span className="text-sm text-gray-400 dark:text-neutral-600">
                (Optional)
              </span>
            </div>

            <div className="col-span-3">
              <textarea
                id="af-account-bio"
                className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                placeholder="Type your Business..."
              >
                {vendor.vendor_description}
              </textarea>

              
              <div className="mt-6 flex gap-4">
                <button className="bg-gray-900 hover:bg-gray-600 border border-gray-700 text-white px-3 py-1 rounded-md">
                  Save changes
                </button>
                <button className="border border-gray-200 text-gray-900 px-3 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <hr className=" w-full border-gray-200 my-5" />

          <h1 className="font-medium text-gray-900 text-lg mb-3">Password</h1>

          {/* <!-- password change --> */}
          <PasswordChange />
          <hr className=" w-full border-gray-200 my-5" />

          <h1 className="font-medium text-gray-900 text-lg mb-3">
            Social accounts
          </h1>

          <div className="grid grid-cols-5 gap-2 sm:gap-5 w-2/3">
            <div className="sm:col-span-2">
              <label
                htmlFor="af-account-password"
                className="inline-block text-sm text-gray-700 mt-2.5 "
              >
                Website
              </label>
            </div>

            <div className="sm:col-span-3 max-w-sm">
              <div className="space-y-2">
                <div className="max-w-sm">
                  <div className="relative">
                    <input
                      type="text"
                      className="py-3 px-4 ps-11 block w-full border-gray-200 border shadow-sm rounded-lg text-sm focus:z-10 focus:border-gray-500 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none "
                      placeholder="you@site.com"
                      value={vendor.vendor_website}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <svg
                        height="218px"
                        width="18px"
                        version="1.1"
                        id="_x32_"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        fill="currentColor"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <style type="text/css"> </style>{" "}
                          <g>
                            {" "}
                            <path
                              className="st0"
                              d="M255.994,0.006C114.607,0.013,0.012,114.612,0,256c0.012,141.387,114.607,255.986,255.994,255.994 C397.393,511.986,511.992,397.387,512,256C511.992,114.612,397.393,0.013,255.994,0.006z M97.607,97.612 c23.34-23.328,51.761-41.475,83.455-52.725c-15.183,18.375-27.84,41.906-37.757,69.116H82.772 C87.452,108.308,92.396,102.824,97.607,97.612z M65.612,138.003h69.986c-9.008,31.929-14.41,67.834-15.363,105.997H32.327 C34.374,205.196,46.3,169.088,65.612,138.003z M65.612,373.997C46.3,342.912,34.374,306.804,32.327,268h87.991 c0.961,38.124,6.21,74.092,15.206,105.998H65.612z M97.607,414.386c-5.211-5.211-10.156-10.695-14.836-16.39h60.573 c4.28,11.774,9.019,22.944,14.312,33.21c6.954,13.438,14.758,25.468,23.348,35.89C149.332,455.846,120.931,437.699,97.607,414.386z M243.998,479.667c-3.746-0.196-7.469-0.477-11.164-0.86c-5.89-2.64-11.722-6.25-17.5-10.961 c-17.632-14.359-33.976-38.671-46.398-69.85h75.061V479.667z M243.998,373.997h-83.436c-9.477-31.171-15.316-67.311-16.328-105.998 h99.763V373.997z M243.998,244H144.31c1.008-38.71,6.875-74.819,16.359-105.997h83.33V244z M243.998,114.003h-74.951 c3.109-7.79,6.367-15.312,9.934-22.195c10.64-20.625,23.17-36.89,36.354-47.656c5.777-4.71,11.609-8.32,17.5-10.96 c3.695-0.382,7.417-0.664,11.164-0.859V114.003z M446.392,138.003c19.312,31.085,31.234,67.194,33.281,105.997h-87.991 c-0.961-38.124-6.21-74.092-15.21-105.997H446.392z M414.393,97.612c5.211,5.211,10.156,10.696,14.836,16.391h-60.577 c-4.281-11.773-9.023-22.945-14.312-33.21c-6.953-13.437-14.758-25.468-23.347-35.89C362.668,56.16,391.065,74.301,414.393,97.612z M267.998,32.333c3.746,0.195,7.469,0.484,11.16,0.859c5.89,2.649,11.723,6.25,17.504,10.96 c17.636,14.359,33.976,38.671,46.397,69.85h-75.061V32.333z M267.998,138.003h83.436c9.476,31.171,15.32,67.31,16.328,105.997 h-99.764V138.003z M267.998,268h99.685c-1.007,38.71-6.874,74.818-16.359,105.998h-83.326V268z M296.661,467.846 c-5.781,4.711-11.614,8.313-17.504,10.961c-3.691,0.375-7.414,0.664-11.16,0.86v-81.67h74.951 c-3.109,7.789-6.367,15.312-9.933,22.195C322.376,440.816,309.845,457.081,296.661,467.846z M414.393,414.386 c-23.336,23.328-51.764,41.476-83.459,52.725c15.187-18.375,27.835-41.905,37.757-69.115h60.538 C424.548,403.692,419.604,409.176,414.393,414.386z M446.392,373.997h-69.998c9.008-31.929,14.414-67.842,15.367-105.998h87.912 C477.626,306.804,465.704,342.912,446.392,373.997z"
                            ></path>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
