import React from "react";
import { Skeleton } from "antd";

const RowLoading = () => {
  return (
    <div>
      <Skeleton.Input active size="small" block className="rounded-md" />
    </div>
  );
};

export default RowLoading;
