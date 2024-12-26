import React, { useRef, useState } from "react";

const Upload = ({ businessLogo, setBusinessLogo }) => {
  const [logoPreview, setLogoPreview] = useState(
    businessLogo || "https://preline.co/assets/img/160x160/img1.jpg" // Default preview if no businessLogo is provided
  );
  const logoRef = useRef(null);

  const handleLogoChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      // Callback when FileReader is done reading the file
      // Updates component state with a preview of the uploaded image
      // and also updates the parent component's state with the preview
      // via the setBusinessLogo prop
      reader.onload = () => {
        const previewUrl = reader.result;
        setLogoPreview(previewUrl); // Update local preview state
        setBusinessLogo(file); // Update parent component's state via prop
      };

      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    logoRef.current?.click();
  };

  return (
    <div className="grid sm:grid-cols-12 gap-2 sm:gap-12 bg-white p-4 rounded-lg shadow-sm">
      <div className="grid sm:grid-cols-12 gap-2 sm:gap-12">
        <div className="sm:col-span-9">
          <div className="flex items-center gap-5">
            {/* Logo Preview */}
            <img
              className="inline-block size-16 rounded-full ring-2 ring-white cursor-pointer"
              src={logoPreview}
              alt="Avatar"
              onClick={handleLogoClick} // Clickable to trigger upload
            />
            <div className="flex gap-x-2">
              <div>
                <button type="button" onClick={handleLogoClick}>
                  <label
                    htmlFor="af-submit-app-upload-logo"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <input
                      id="af-submit-app-upload-logo"
                      name="af-submit-app-upload-logo"
                      type="file"
                      className="sr-only"
                      onChange={handleLogoChange}
                      ref={logoRef}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
