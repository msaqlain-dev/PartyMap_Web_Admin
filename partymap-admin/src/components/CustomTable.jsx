import { Empty, Table, Skeleton } from "antd";
import "../index.css";
import * as Loader from "./Loaders";

const CustomTable = ({
  rowSelection,
  columns,
  dataSource,
  pagination = true,
  pageLimit,
  metaData,
  setPagination,
  isLoading,
  loadingRows = 5,
  x,
}) => {
  // Define a custom row selection with loader support
  const customRowSelection = isLoading
    ? {
        renderCell: () => <Loader.TableActionLoader />,
      }
    : rowSelection;

  // Define pagination settings
  const paginationConfig = pagination
    ? {
        className: "custom-pagination pr-5",
        size: "small",

        pageSize: pageLimit,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        showQuickJumper: true,
        current: metaData?.currentPage,
        total: metaData?.totalRecords,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }
    : false;

  return (
    <>
      <Table
        scroll={{ x: x ?? 800 }}
        pagination={isLoading ? false : paginationConfig}
        columns={columns}
        dataSource={Array.isArray(dataSource) ? dataSource : []}
        rowSelection={customRowSelection}
        style={{
          borderBottomLeftRadius: "7px",
          borderBottomRightRadius: "7px",
        }}
        rowKey={(record) => record._id}
        className="custom-table"
        components={{
          header: {
            cell: ({ children, ...restProps }) => (
              <th
                {...restProps}
                className="bg-white"
                style={{
                  color: "black",
                  borderRadius: "0px",
                  fontSize: "0.9em",
                  fontWeight: 500,
                }}
              >
                {children}
              </th>
            ),
          },
          body: {
            wrapper: ({ children, ...restProps }) => (
              <tbody {...restProps}>
                {isLoading
                  ? // Show loaders for each column as defined
                    [...Array(loadingRows)].map((_, rowIndex) => (
                      <tr key={`loading-${rowIndex}`}>
                        {customRowSelection ? (
                          <td key={`loading-checkbox-${rowIndex}`}>
                            <Loader.TableRowSelectionLoader />
                          </td>
                        ) : null}

                        {/* Render loaders for each column */}
                        {columns.map((column, colIndex) => (
                          <td key={`loading-col-${colIndex}`}>
                            {column.loader ? (
                              column.loader
                            ) : (
                              <Skeleton.Input
                                active
                                size="small"
                                className="rounded-md"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  : children}
              </tbody>
            ),
          },
        }}
        onChange={setPagination}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No Data</span>}
            />
          ),
        }}
      />
      {isLoading && (
        <div className="flex justify-end my-4 mx-5">
          <Skeleton.Button
            active
            size="small"
            style={{ width: "200px" }}
            className="rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default CustomTable;
