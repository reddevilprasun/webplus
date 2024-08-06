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
} from "@nextui-org/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import { parseDate, getLocalTimeZone } from "@internationalized/date";


const anomalyColumns = [
  { uid: "ip", name: "IP" },
  { uid: "datetime", name: "Date & Time" },
  { uid: "method", name: "Method" },
  { uid: "url", name: "URL" },
  { uid: "status", name: "Status" },
  { uid: "size", name: "Size" },
  { uid: "referrer", name: "Referrer" },
  { uid: "user_agent", name: "User Agent" },
  { uid: "hour", name: "Hour" },
  { uid: "anomaly", name: "Anomaly" },
];

type AnomalyDetail = {
  ip: string;
  datetime: string;
  method: string;
  url: string;
  status: number;
  size: number;
  referrer: string;
  user_agent: string;
  hour: number;
  anomaly: number;
};

type ReportData = {
  total_requests: number;
  unique_ips: number;
  status_code_distribution: Record<string, number>;
  request_method_distribution: Record<string, number>;
  hourly_request_distribution: Record<string, number>;
  hourly_method_distribution: Array<Record<string, number>>;
  anomalies: number;
  anomaly_details?: Array<AnomalyDetail>;
};

type Props = {
  reportData: ReportData | null;
};

type FilterState = Selection;

const INITIAL_VISIBLE_COLUMNS = [
  "ip",
  "datetime",
  "method",
  "url",
  "status",
  "size",
  "referrer",
  "user_agent",
  "hour",
  "anomaly",
];

export default function ReportPage({ reportData }: Props) {
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<RangeValue<DateValue> | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<FilterState>("all");
  const [methodFilter, setMethodFilter] = React.useState<FilterState>("all");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string> | "all">(new Set(["ip", "datetime", "method", "url", "status", "size", "referrer", "user_agent", "hour", "anomaly"]));
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ column: "datetime", direction: "ascending" });
  const [page, setPage] = React.useState<number>(1);

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

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return anomalyColumns;
    return anomalyColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredAnomalies = [...(reportData?.anomaly_details || [])];

    // Apply search filter
    if (filterValue) {
      filteredAnomalies = filteredAnomalies.filter((anomaly) =>
        anomaly.ip.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    // Apply date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      filteredAnomalies = filteredAnomalies.filter((anomaly) => {
        const anomalyDate = new Date(anomaly.datetime);
        return anomalyDate >= dateRange.start.toDate(getLocalTimeZone()) && anomalyDate <= dateRange.end.toDate(getLocalTimeZone());
      });
    }

    // Apply status code filter
    if (statusFilter !== "all") {
      filteredAnomalies = filteredAnomalies.filter((anomaly) =>
        Array.from(statusFilter).includes(anomaly.status.toString())
      );
    }

    // Apply method filter
    if (methodFilter !== "all") {
      filteredAnomalies = filteredAnomalies.filter((anomaly) =>
        Array.from(methodFilter).includes(anomaly.method)
      );
    }

    return filteredAnomalies;
  }, [reportData?.anomaly_details, filterValue, dateRange, statusFilter, methodFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: AnomalyDetail, b: AnomalyDetail) => {
      const first = new Date(a[sortDescriptor.column as keyof AnomalyDetail] as string).getTime();
      const second = new Date(b[sortDescriptor.column as keyof AnomalyDetail] as string).getTime();
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((anomaly: AnomalyDetail, columnKey: React.Key) => {
    const cellValue = anomaly[columnKey as keyof AnomalyDetail];
    switch (columnKey) {
      case "datetime":
        return new Date(cellValue as string).toLocaleString();
      default:
        return cellValue;
    }
  }, []);

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
            onValueChange={(value) => onSearchChange(value)}
          />
          <div className="flex gap-3">
            <DateRangePicker
              label="Date Range"
              className="max-w-xs"
              value={dateRange}
              onChange={(value) => setDateRange(value as RangeValue<DateValue> | null)}
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                {Object.keys(reportData?.status_code_distribution || {}).map((status) => (
                  <DropdownItem key={status}>
                    {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                {Object.keys(reportData?.request_method_distribution || {}).map((method) => (
                  <DropdownItem key={method}>
                    {method}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {filteredItems.length} anomalies</span>
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
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);


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
            allowsSorting
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item.datetime}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
