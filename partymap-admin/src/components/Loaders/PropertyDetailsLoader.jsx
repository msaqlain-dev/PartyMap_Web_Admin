import { Skeleton } from "antd";
import React from "react";

const PropertyDetailsLoader = () => {
  return (
    <div className="flex gap-5 " >
      <Skeleton.Node
        active
        style={{ width: 500, height: 400 }}
        className="rounded-md"
      />
    </div>
  );
};

export default PropertyDetailsLoader;
