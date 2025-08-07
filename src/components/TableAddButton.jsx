import { PlusIcon } from "../assets/icons";

const TableAddButton = ({ onClick, label, icon }) => {
  return (
    <button
      className="bg-secondary bg-gradient-to-b from-[#f740bd] to-[#E10098] hover:from-[#E10098] hover:to-[#E10098] text-[1em] rounded-md py-[10px] px-5 lg:px-3 xl:px-5 font-medium text-white flex items-center gap-3 lg:gap-1 xl:gap-3 transition-all duration-300"
      onClick={onClick}
    >
      {icon || <PlusIcon />} {label}
    </button>
  );
};

export default TableAddButton;
