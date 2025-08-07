// content/DropDownData.jsx
export const markersOptions = [
  {
    label: (
      <span className="text-gray-700 font-medium flex items-center">
        View Details
      </span>
    ),
    key: "view",
  },
  {
    label: (
      <span className="text-gray-700 font-medium flex items-center">
        Edit Marker
      </span>
    ),
    key: "edit",
  },
  {
    type: "divider",
  },
  {
    label: (
      <span className="text-red-600 font-medium flex items-center">
        Delete Marker
      </span>
    ),
    key: "delete",
  },
];