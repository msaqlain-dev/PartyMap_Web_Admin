export const MarkersTableColumn = [
  { id: 1, label: "Type", dataIndex: "markerType", visible: true },
  { id: 2, label: "Place", dataIndex: "placeName", visible: true },
  { id: 3, label: "Party Time", dataIndex: "partyTime", visible: true },
  { id: 4, label: "Latitude", dataIndex: "latitude", visible: true },
  { id: 5, label: "Longitude", dataIndex: "longitude", visible: true },
  { id: 6, label: "Label", dataIndex: "markerLabel", visible: true },
];

export const PolygonsTableColumn = [
  {
    id: 1,
    label: "Name",
    dataIndex: "name",
    visible: true,
  },
  {
    id: 2,
    label: "Type",
    dataIndex: "polygonType",
    visible: true,
  },
  {
    id: 3,
    label: "Coordinates",
    dataIndex: "coordinateCount",
    visible: true,
  },
  {
    id: 4,
    label: "Associated Marker",
    dataIndex: "marker",
    visible: true,
  },
  {
    id: 5,
    label: "Visibility",
    dataIndex: "isVisible",
    visible: false,
  },
  {
    id: 6,
    label: "Height",
    dataIndex: "height",
    visible: true,
  },
];
