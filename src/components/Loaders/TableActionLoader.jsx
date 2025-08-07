import React from "react";
import { Skeleton } from "antd";

const ActionLoading = () => {
  return (
    <Skeleton.Avatar
      active
      size={20}
      shape="square"
      style={{ width: "30px" }}
      className="rounded-md"
    />
  );
};

export default ActionLoading;
