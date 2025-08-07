import FormContentLoader from "./FormContentLoader";
import StepperLoader from "./StepperLoader";


const FormLoader = () => {
  return (
    <div className="flex flex-col gap-16 mt-10 " >
      <StepperLoader />
      <FormContentLoader />
    </div>
  );
};

export default FormLoader;
