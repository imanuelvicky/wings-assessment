"use client";
import React, { useState } from "react";
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
  Tooltip,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
import {
  PlusIcon,
  ChevronDownIcon,
  SearchIcon,
  IconEye,
  IconEdit,
  IconDelete,
} from "@assets/icons";
import { capitalize } from "@utils/helper/Utils";
import { TaskInterface } from "@interfaces/taskInterface";
import { columns } from "@utils/data/dataTask";
import DashboardSkeleton from "@app/skeleton";
import { UserInterface } from "@interfaces/userInterface";
import EditTaskModal from '../EditTaskModal'
import AddTaskModal from '../AddTaskModal'
import DeleteTaskModal from '../DeleteTaskModal'
import { apiUpdateTaskComplete } from "@services/api/apiTask";
import { toast } from "react-toastify";
const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "title",
  "description",
  "due_date",
  "complete",
  "id_account",
  "actions",
];

export default function TaskTable({
  taskData,
  userData
}: Readonly<{
  taskData: TaskInterface[];
  userData: UserInterface[];
}>) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [tasks] = useState<TaskInterface[]>(taskData);
  const [user] = useState<UserInterface[]>(userData)
  const [loading, setLoading] = useState(false)
  const [userLoading] = useState(false);
  const [completes, setCompletes] = useState<TaskInterface[]>(taskData);

  const handleCheckboxChange = async (id: number, newStatus: boolean) => {
    setLoading(true);
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, complete: newStatus ? 1 : 0 } : task
    );
  
    // Update the UI optimistically
    setCompletes(updatedTasks);
  
    const body = { id, complete: newStatus ? 1 : 0 };
  
    try {
      await apiUpdateTaskComplete(body);
      toast.success(`Task ${id} completion status successfully updated.`, {
        position: 'top-center',
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error(`Unable to update the task status. Please try again.`, {
        position: 'top-center',
      });
  
      // Revert the optimistic update in case of an error
      setCompletes(tasks);
    } finally {
      setLoading(false);
    }
  };

  //Handler Modal
  const { isOpen: isAddTaskModalOpen, onOpenChange: onAddTaskModalOpenChange } =
      useDisclosure();
  const {
      isOpen: isEditTaskModalOpen,
      onOpenChange: onEditTaskModalOpenCHange,
  } = useDisclosure();
  const {
      isOpen: isDeleteTaskModalOpen,
      onOpenChange: onDeleteTaskModalOpenChange,
  } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<TaskInterface | null>(null);
  const openTaskEditModal = (task: TaskInterface) => {
      setSelectedTask(task);
      onEditTaskModalOpenCHange();
  };
  const openTaskDeleteModal = (task: TaskInterface) => {
      setSelectedTask(task);
      onDeleteTaskModalOpenChange();
  };
  const onCloseEditTaskModal = () => {
      setSelectedTask(null);
      onEditTaskModalOpenCHange();
  };
  const onCloseDeleteTaskModal = () => {
      setSelectedTask(null);
      onDeleteTaskModalOpenChange();
  };
  const pages = Math.ceil(tasks.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredTasks = [...tasks];

    if (hasSearchFilter) {
      filteredTasks = filteredTasks.filter((task) => {
        const searchValue = filterValue.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchValue) ||
          task.description.toLowerCase().includes(searchValue)
        );
      });
    }

    return filteredTasks;
  }, [tasks, filterValue, hasSearchFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: TaskInterface, b: TaskInterface) => {
      const first = a[sortDescriptor.column as keyof TaskInterface] as number;
      const second = b[sortDescriptor.column as keyof TaskInterface] as number;
      const result = first > second ? 1 : 0;
      const cmp = first < second ? -1 : result;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (task: TaskInterface, columnKey: React.Key) => {
    const cellValue = task[columnKey as keyof TaskInterface];
    const foundUser = user.find(item => item.id === cellValue);
    const dataUser = foundUser ? `${foundUser.username}` : '';
  
    switch (columnKey) {
      case "id":
      case "title":
      case "description":
      case "due_date":
        return (
          <div className="flex flex-col h-10 justify-center">
            <p className="text-bold text-medium capitalize">{cellValue}</p>
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col h-10 justify-center ml-8">
            <Checkbox color="success" isSelected={cellValue == 1}></Checkbox>
          </div>
        );
      case "id_account":
        return (
          <div className="flex flex-col h-10 justify-center">
            <p className="text-bold text-medium capitalize">{`${cellValue} - ${dataUser}`}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip color="success" content="Edit task">
              <button
                onClick={() => openTaskEditModal(task)}
                className="text-xl text-success cursor-pointer active:opacity-50"
              >
                <IconEdit />
              </button>
            </Tooltip>
            <Tooltip color="danger" content="Delete task">
              <button
                onClick={() => openTaskDeleteModal(task)}
                className="text-xl text-danger cursor-pointer active:opacity-50"
              >
                <IconDelete />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };
  

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%] ",
              inputWrapper: "",
            }}
            placeholder="Search by task title or description..."
            size="md"
            startContent={<SearchIcon className="text-medium" />}
            value={filterValue}
            variant="faded"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="border-1 border-[#092D74]"
                  endContent={<ChevronDownIcon className="text-medium" />}
                  size="md"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-[#092D74]  text-background"
              onClick={onAddTaskModalOpenChange}
              endContent={<PlusIcon />}
              size="md"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className=" text-medium">Total {tasks.length} tasks</span>
          <label className="flex items-center text-medium">
            <p>Rows per page:</p>
            <select
              className="bg-transparent outline-none text-medium"
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
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    tasks.length,
    onAddTaskModalOpenChange
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-[#092D74] text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="faded"
          onChange={setPage}
        />
      </div>
    );
  }, [page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-medium", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  if (loading || userLoading) return <DashboardSkeleton />;
  return (
    <>
      <h2 className="text-xl font-semibold pb-4">Master Task</h2>
      <Table
        isCompact
        removeWrapper
        aria-label="Data Table Task"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
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
              className="text-[#092D74]"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No tasks found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={onAddTaskModalOpenChange}
        title="Add task"
        data={tasks}
      />
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={onCloseEditTaskModal}
        title="Edit Task"
        data={tasks}
        taskData={selectedTask as TaskInterface}
      />
      <DeleteTaskModal
        isOpen={isDeleteTaskModalOpen}
        onClose={onCloseDeleteTaskModal}
        title="Delete Task Confirmation"
        taskData={selectedTask}
      />
    </>
  );
}
