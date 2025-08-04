import { PlusIcon } from "../assets/icons";

const TableAddButton = ({ onClick, label, icon }) => {
  return (
    <button
      className="bg-secondary bg-gradient-to-b from-[#1ab5c0] to-[#1996a6] hover:from-[#1996a6] hover:to-[#1a7684] text-[1em] rounded-md py-[10px] px-5 lg:px-3 xl:px-5 font-medium text-white flex items-center gap-3 lg:gap-1 xl:gap-3 transition-all duration-300"
      onClick={onClick}
    >
      {icon || <PlusIcon />} {label}
    </button>
  );
};

export default TableAddButton;
