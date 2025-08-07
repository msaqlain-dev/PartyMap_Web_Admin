import { Skeleton } from "antd";
import React from "react";

const StepperLoader = () => {
  return (
    <div className="flex gap-6 justify-center items-center">
      <div className="flex flex-col gap-3 items-center">
        <Skeleton.Node
          active
          style={{ width: 70, height: 60 }}
          className="rounded-md"
        />
        <Skeleton.Avatar
          active
          shape="square"
          style={{ width: 100, height: 20 }}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-3 items-center ">
        <Skeleton.Node
          active
          style={{ width: 70, height: 60 }}
          className="rounded-md"
        />
        <Skeleton.Avatar
          active
          shape="square"
          style={{ width: 100, height: 20 }}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <Skeleton.Node
          active
          style={{ width: 70, height: 60 }}
          className="rounded-md"
        />
        <Skeleton.Avatar
          active
          shape="square"
          style={{ width: 100, height: 20 }}
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default StepperLoader;
