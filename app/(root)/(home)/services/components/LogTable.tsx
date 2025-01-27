"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  DateRangePicker,
} from "@heroui/react";
import { ChevronDownIcon, MoreHorizontal, SearchIcon, SortAsc } from "lucide-react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { Doc, Id } from "@/convex/_generated/dataModel";

type AnomalyDetail = Doc<"logInformation">;
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/app/(auth)/features/auth/api/user-current";
import { format } from "date-fns";
import { Chip, ChipProps } from "@heroui/chip";
import { toast } from "sonner";

const anomalyColumns = [
  { uid: "ip", name: "IP", sortable: true },
  { uid: "timestamp", name: "Date & Time" },
  { uid: "method", name: "Method" },
  { uid: "url", name: "URL" },
  { uid: "statusCode", name: "Status", sortable: true },
  { uid: "event", name: "Events" },
  { uid: "responseTime", name: "Response Time" },
  { uid: "requestBody", name: "Request Body" },
  { uid: "responseBody", name: "Response Body" },
  { uid: "userAgent", name: "User Agent" },
  { uid: "actions", name: "Actions" },
];

const statusCodes = [
  "100", // Continue
  "101", // Switching Protocols
  "200", // OK
  "201", // Created
  "202", // Accepted
  "204", // No Content
  "301", // Moved Permanently
  "302", // Found
  "304", // Not Modified
  "400", // Bad Request
  "401", // Unauthorized
  "403", // Forbidden
  "404", // Not Found
  "405", // Method Not Allowed
  "500", // Internal Server Error
  "501", // Not Implemented
  "502", // Bad Gateway
  "503", // Service Unavailable
  "504", // Gateway Timeout
  "505", // HTTP Version Not Supported
];

const httpStatusOptions = [
  {name: "OK", code: 200},
  {name: "Created", code: 201},
  {name: "Accepted", code: 202},
  {name: "No Content", code: 204},
  {name: "Bad Request", code: 400},
  {name: "Unauthorized", code: 401},
  {name: "Forbidden", code: 403},
  {name: "Not Found", code: 404},
  {name: "Internal Server Error", code: 500},
  {name: "Service Unavailable", code: 503},
];

const httpStatusColorMap: Record<string , ChipProps["color"]> = {
  200: "success",        // OK
  201: "success",        // Created
  202: "success",        // Accepted
  204: "success",        // No Content
  400: "danger",         // Bad Request
  401: "danger",         // Unauthorized
  403: "danger",         // Forbidden
  404: "danger",         // Not Found
  500: "danger",         // Internal Server Error
  503: "danger",         // Service Unavailable
};


const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "CONNECT",
  "TRACE",
];

type FilterState = Selection;

const INITIAL_VISIBLE_COLUMNS = [
  "ip",
  "timestamp",
  "method",
  "url",
  "statusCode",
  "actions",
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export default function LogTable() {
  const user = useCurrentUser();
  const {
    results: reportData,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.premium.currentPremiumUserLogs,
    { userId: user.data?._id },
    { initialNumItems: 10 }
  );
  console.log(reportData);
  

  const [filterValue, setFilterValue] = React.useState("");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<FilterState>("all");
  const [methodFilter, setMethodFilter] = React.useState<FilterState>("all");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<
    Set<string> | "all"
  >(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "statusCode",
    direction: "ascending",
  });
  const [page, setPage] = React.useState<number>(1);
  const hasSearchFilter = Boolean(filterValue);
  

  


  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return anomalyColumns;
    return anomalyColumns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAnomalies = [...(reportData || [])];

    // Apply search filter
    if (hasSearchFilter) {
      filteredAnomalies = filteredAnomalies.filter((anomaly) =>
        anomaly.ip?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      filteredAnomalies = filteredAnomalies.filter((anomaly) => {
        const anomalyDate = anomaly.timestamp
          ? new Date(anomaly.timestamp)
          : new Date();
        return (
          anomalyDate >= dateRange.start.toDate(getLocalTimeZone()) &&
          anomalyDate <= dateRange.end.toDate(getLocalTimeZone())
        );
      });
    }

    // Apply status code filter
    if (statusFilter !== "all" && Array.from(statusFilter).length !== httpStatusOptions.length) {
      filteredAnomalies = filteredAnomalies.filter((anomaly) =>
          anomaly.statusCode !== undefined &&
          Array.from(statusFilter).includes(anomaly.statusCode.toString())
      );
    }

    // Apply method filter
    if (methodFilter !== "all") {
      filteredAnomalies = filteredAnomalies.filter(
        (anomaly) =>
          anomaly.method !== undefined &&
          Array.from(methodFilter).includes(anomaly.method)
      );
    }

    return filteredAnomalies;
  }, [reportData, filterValue, dateRange, statusFilter, methodFilter,hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onNextPage = React.useCallback(async () => {
    if (page < pages) {
      setPage(page + 1);
    } else if (page === pages && status === "CanLoadMore") {
      // Load more data when reaching the last page and there's more data to load
      await loadMore(25);
    }
  }, [page, status, loadMore, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: AnomalyDetail, b: AnomalyDetail) => {
      const first = a[sortDescriptor.column as keyof AnomalyDetail] as number;
      const second = b[sortDescriptor.column as keyof AnomalyDetail] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (anomaly: AnomalyDetail, columnKey: React.Key) => {
      const cellValue = anomaly[columnKey as keyof AnomalyDetail];
      switch (columnKey) {
        case "timestamp":
          return format(new Date(cellValue as string), "yyyy-MM-dd HH:mm:ss");
        case "statusCode":
          return (
            <>
            {!cellValue ? (<Chip className="capitalize" size="sm" variant="flat" color="default">N/A</Chip>) : (

              <Chip className="capitalize" size="sm" variant="flat" color={anomaly.statusCode ? httpStatusColorMap[anomaly.statusCode.toString()] : "default"}>
              {cellValue}
            </Chip>
            )}
            </>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreHorizontal className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="view">View</DropdownItem>
                  <DropdownItem key="edit">Edit</DropdownItem>
                  <DropdownItem key="delete">Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "ip": 
          return (
            <Button className="hover:underline text-start truncate w-32 hover:text-blue-600" variant="light"
              onClick={() => {
                //copy to clipboard
                navigator.clipboard.writeText(cellValue as string).then(() => {
                  toast.success("IP copied to clipboard");
                });
              }}
            >
              {cellValue}
            </Button>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setDateRange(null);
    setStatusFilter("all");
    setMethodFilter("all");
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by IP..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <DateRangePicker
              label="Date Range"
              className="max-w-xs"
              value={dateRange}
              onChange={(value) =>
                setDateRange(value as RangeValue<DateValue> | null)
              }
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status Code
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Codes"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusCodes.map((status) => (
                  <DropdownItem key={status}>{status}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(keys as Set<string>)}
              >
                {anomalyColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Method
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Methods"
                closeOnSelect={false}
                selectedKeys={methodFilter}
                selectionMode="multiple"
                onSelectionChange={setMethodFilter}
              >
                {httpMethods.map((method) => (
                  <DropdownItem key={method}>{method}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} anomalies
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    dateRange,
    statusFilter,
    methodFilter,
    onSearchChange,
    onRowsPerPageChange,
    filteredItems.length,
    onClear,
    visibleColumns,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    page,
    pages,
    filteredItems.length,
    onNextPage,
    onPreviousPage,
  ]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[682px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      {sortedItems.length === 0 ? (
        <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
      ) : (
        <TableBody items={sortedItems}
        >
          {(item: AnomalyDetail) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  );
}
