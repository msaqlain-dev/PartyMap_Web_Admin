import React from "react";
import { Skeleton } from "antd";

const TableRowSelectionLoader = () => {
  return (
    <Skeleton.Avatar
      active
      size={20}
      shape="square"
      style={{ width: "20px" }} 
      className="rounded-md"
    />
  );
};

export default TableRowSelectionLoader;
