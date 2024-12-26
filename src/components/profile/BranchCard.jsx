import React from "react";

interface BranchCardProps {
  branchName: string;
  branchAddress: string;
  branchPhoneNumber: string;
  branchRegion: string;
  branchCountry: string;
  branchCity: string;
  mapUrl: string;
}

const BranchCard: React.FC<BranchCardProps> = ({
  branchName,
  branchAddress,
  branchPhoneNumber,
  branchRegion,
  branchCountry,
  branchCity,
  mapUrl,
}) => {
  return (
    <div className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75h.008v.008H9v-.008zm0 3.75h.008v.008H9V16.5zm0-7.5h.008v.008H9V9zm3 3.75h.008v.008H12v-.008zm0 3.75h.008v.008H12V16.5zm0-7.5h.008v.008H12V9zm3 3.75h.008v.008H15v-.008zm0 3.75h.008v.008H15V16.5zm0-7.5h.008v.008H15V9zM3.375 6.75A2.625 2.625 0 016 4.125h12A2.625 2.625 0 0120.625 6.75v10.5a2.625 2.625 0 01-2.625 2.625H6a2.625 2.625 0 01-2.625-2.625V6.75z"
              />
            </svg>
          </div>
          <span className="text-lg font-medium">{branchName}</span>
        </div>

        {/* Sign out button */}
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded-md text-sm">
          <span>↗ View Branch</span>
        </button>
      </div>

      {/* Address Info */}
      <div className="text-sm text-gray-600 space-y-2">
        <div>
          <span className="font-medium">Address:</span> {branchAddress}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {branchPhoneNumber}
        </div>
        <div>
          <span className="font-medium">City:</span> {branchCity}
        </div>
        <div>
          <span className="font-medium">Region:</span> {branchRegion}
        </div>
        <div>
          <span className="font-medium">Country:</span> {branchCountry}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="border-t mt-4 pt-4">
        <span className="font-medium">Branch Location:</span>
        <div className="mt-2">
          <iframe
            title="Branch Map"
            className="w-full h-48 rounded-lg"
            src={mapUrl}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default BranchCard;
