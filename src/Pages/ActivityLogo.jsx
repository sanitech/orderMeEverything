import React, { useEffect } from "react";
import { getAllActivityLog } from "../utils/activitylogUtils";
import { formatDate } from "../constant/MVData";

const ActivityLog = () => {
  const [activity, setActivity] = React.useState([]);

  useEffect(() => {
    const getAllActivities = async () => {
      try {
        const activities = await getAllActivityLog();
        console.log(activities)
        setActivity(activities);
      } catch (error) {
        console.log(error);
      }
    };
    getAllActivities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Tabs */}
      <div className="flex border-b text-gray-600">
        <button className="py-2 px-6 text-black font-semibold border-b-2 border-black">
          Activity
        </button>
        <button className="py-2 px-6 hover:text-gray-800">Assigned (2)</button>
        <button className="py-2 px-6 hover:text-gray-800">
          Need to review
        </button>
      </div>

      {/* Log Section */}
      <div className="border-t p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Log</h3>
          <button className="text-gray-600 hover:underline">Add Filter</button>
        </div>

        {/* Log Items */}
        <div className="space-y-6">
          {/* Started Course */}
          {activity.map((activity) => (
            <div className="relative pl-8">
              <div className="absolute top-0 left-0 w-4 h-4 bg-orange-500 rounded-full"></div>
              <p className="text-gray-800 font-medium">
                {activity.vendor_name}{" "}
                <span className="text-orange-500 hover:underline cursor-pointer">
                  {activity.activity_type}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                {formatDate(activity.created_at)}
              </p>

              <div className="mt-2 p-3 bg-gray-100 rounded-lg text-gray-700 text-sm">
                {activity.activity_description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
