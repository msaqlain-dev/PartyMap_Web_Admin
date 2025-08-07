import { Skeleton } from "antd";

const FormContentLoader = () => {
  return (
    <div className="flex flex-col gap-5 px-6 ">
      <Skeleton.Input active block size="small" className="rounded-md" />
      <Skeleton.Input active block size="small" className="rounded-md" />
      <Skeleton.Input active size="small" className="rounded-md" />
    </div>
  );
};

export default FormContentLoader;
