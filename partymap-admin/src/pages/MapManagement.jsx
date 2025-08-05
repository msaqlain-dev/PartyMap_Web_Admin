import { useState, useEffect, useCallback, Fragment } from "react";
import {
  CustomTable,
  SearchField,
  TableCustomizeColumnMenu,
} from "../components";
import { MarkersTableColumn } from "../content/TableCustomizeColumnData";
import { MarkersDefaultFilter } from "../content/DefaultFilters";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useFetch from "../hooks/useFetch";
import { debounce } from "../utils";
import { markersOptions } from "../content/DropDownData";
import * as Loader from "../components/Loaders";
import TableAddButton from "../components/TableAddButton";
import { Space } from "antd";

const MapManagement = () => {
  const [checkedTableMenuColumn, setCheckedTableMenuColumn] =
    useState(MarkersTableColumn);
  const [propertyNameToDelete, setPropertyNameToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filter, setFilter] = useState(MarkersDefaultFilter);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [isRenderScreen, setIsRenderScreen] = useState(false);

  const navigate = useNavigate();

  // Get All properties with filter
  const { data, loading, error } = useFetch("/markers", filter, [
    filter,
    isRenderScreen,
  ]);

  // Handle API Error
  useEffect(() => {
    error && error?.message && toast.error(error.message);
  }, [error]);

  // handle filter change
  const handleFilter = (name, value) => {
    if (name === "filter") {
      setFilter((prev) => ({
        ...prev,
        ...value,
        page: 1,
      }));
    } else if (name === "pagination") {
      setFilter((prev) => ({
        ...prev,
        page: value.current,
        limit: value.pageSize,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [name]: value,
        page: 1,
      }));
    }
    setSelectedRowKeys([]);
  };

  // Handle DropDown Click
  const handleMenuClick = (key, record) => {
    if (key === "view") {
      // navigate(`/properties/${record._id}`);
    } else if (key === "delete") {
      // setSelectedPropertyId(record._id);
      // const nameToDelete = record.propertyName;
      // setPropertyNameToDelete(nameToDelete);
      // setIsDeleteModalOpen(true);
    } else if (key === "edit") {
      // if (record?.status !== "draft") {
      //   setSelectedPropertyId(record._id);
      //   btnHandler();
      // } else {
      //   hanldeDraftOpen(record._id);
      // }
    }
  };

  const onRowSelectionChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelectionChange,
  };

  const handleFilterChange = (selectedFilters, isDraftReset = false) => {
    // Format filters
    const formatedFilters = selectedFilters.reduce(
      (acc, item) => {
        if (item === "isArchive") {
          acc.isArchive = true;
        } else if (item === "active" || item === "inActive") {
          acc.status = acc.status ? `${acc.status},${item}` : item;
        } else {
          acc.type = acc.type ? `${acc.type},${item}` : item;
        }
        return acc;
      },
      { status: "", type: "", isArchive: false }
    );

    // Reset draft
    if (isDraftReset) {
      formatedFilters.isDraft = false;
    }

    // upodate filters
    handleFilter("filter", formatedFilters);
  };

  // Memoize the debouncedSearch function using useCallback
  const debouncedSearch = useCallback(
    debounce((value) => {
      handleFilter("search", value);
    }, 500),
    []
  );

  // Handle Search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  //handlle draft open
  const hanldeDraftOpen = (propertyId) => {
    setSelectedPropertyId(propertyId);
    btnHandler(true);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "markerType",
      loader: <Loader.TableRowLoader />,
      render: (type) => (
        <span className="capitalize font-medium text-gray-700">{type}</span>
      ),
    },
    {
      title: "Place",
      dataIndex: "placeName",
      loader: <Loader.TableRowLoader />,
      render: (placeName, record) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            {placeName}
          </span>
          <span className="text-xs text-gray-500">{record.markerLabel}</span>
        </div>
      ),
    },
    {
      title: "Party Time",
      dataIndex: "partyTime",
      loader: <Loader.TableRowLoader />,
      render: (time) => {
        const colors = {
          day: "bg-yellow-200 text-yellow-800",
          noon: "bg-blue-200 text-blue-800",
          evening: "bg-purple-200 text-purple-800",
          night: "bg-gray-800 text-white",
        };
        return (
          <span
            className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${
              colors[time] || "bg-gray-200 text-gray-700"
            }`}
          >
            {time}
          </span>
        );
      },
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      loader: <Loader.TableRowLoader />,
      render: (lat) => <span className="text-sm text-gray-700">{lat}</span>,
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      loader: <Loader.TableRowLoader />,
      render: (lng) => <span className="text-sm text-gray-700">{lng}</span>,
    },
    {
      title: "Label",
      dataIndex: "markerLabel",
      loader: <Loader.TableRowLoader />,
      render: (label) => (
        <span className="text-sm font-medium text-indigo-600">{label}</span>
      ),
    },
    // {
    //   title: "",
    //   dataIndex: "action",
    //   loader: <Loader.TableActionLoader />,
    //   render: (_, record) => (
    //     <Space size="middle" className="flex justify-center">
    //       <Components.DropDownMenu
    //         menuItems={markersOptions}
    //         onMenuClick={(actionKey) => handleMenuClick(actionKey, record)}
    //       />
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Fragment>
      {/* Desktop View */}
      <div className="flex flex-col border my-5 2xl:my-5 mx-5 2xl:mx-14 rounded-lg shadow-lg">
        <div className="w-full flex flex-wrap items-center px-5 py-3 ">
          <div className="w-full flex flex-col-reverse xl:flex-row gap-5">
            <div className="flex gap-5 items-center w-full xl:w-1/2 ">
              <div id="step5" className="w-full xl:w-[400px]">
                <SearchField
                  mobilePlaceholder="Search by Type, Place, Time or Label"
                  placeholder="Search by Type, Place, Time or Label"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              {/* <div id="step4">
                <Components.SortDropdown
                  sortOptions={sortOptions}
                  propertyType={true}
                  onSortChange={(value) => handleFilter("sortBy", value)}
                />
              </div>
              <div id="step3">
                <Components.FilterDropdown
                  isDraft={filter?.isDraft}
                  columnsData={
                    filter?.isDraft
                      ? propertyFiltersDraftData
                      : propertyFiltersData
                  }
                  onFilterChange={handleFilterChange}
                />
              </div> */}
            </div>
            <div
              className={`flex items-center ${
                selectedRowKeys.length ? "justify-between" : "justify-end"
              } xl:justify-end gap-4 w-full xl:w-1/2`}
            >
              {selectedRowKeys.length > 0 && (
                <div className="flex items-center gap-4">
                  <Components.DeleteButton
                  // onClick={() => setIsDeleteModalOpen(true)}
                  />
                </div>
              )}
              <div className="flex items-center gap-4">
                <div id="step1">
                  <TableAddButton
                    onClick={() => {}}
                    label={"Add New Property"}
                  />
                </div>
                <div className="">
                  <TableCustomizeColumnMenu
                    setCheckedTableMenuColumn={setCheckedTableMenuColumn}
                    checkedTableMenuColumn={checkedTableMenuColumn}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="step6">
          {/* Table component */}
          <CustomTable
            columns={columns.filter(
              (column) =>
                column.dataIndex === "action" ||
                checkedTableMenuColumn.some(
                  (col) => col.dataIndex === column.dataIndex && col.visible
                )
            )}
            dataSource={data?.data || []}
            pagination={true}
            rowSelection={rowSelection}
            pageLimit={filter.limit}
            setPagination={(pagination) =>
              handleFilter("pagination", pagination)
            }
            metaData={data?.metaData}
            isLoading={loading}
          />
        </div>
      </div>

      {/* <Components.InformationModal
        isOpen={informationModel.isOpen}
        description={informationModel.description}
        onClose={handleCloseInformationModel}
        onCross={handleCloseInformationModel}
        title="Property Information"
        primaryBtnText="Got it"
      /> */}

      {/* Delete Modal */}
      {/* <Components.DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPropertyId(null);
        }}
        itemName={selectedRowKeys.length ? "Delete" : propertyNameToDelete}
        title="Delete Property"
        onSubmit={deleteProperties}
      /> */}
    </Fragment>
  );
};

export default MapManagement;
