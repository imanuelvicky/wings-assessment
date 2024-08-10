"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DropdownMenu,
  DropdownTrigger,
  Dropdown,
  DropdownItem,
} from "@nextui-org/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  TaskFormInterface,
  TaskInterface,
} from "@interfaces/taskInterface";
import { toast } from "react-toastify";
import { apiUpdateTask } from "@services/api/apiTask";
import { ChevronDownIcon } from "@assets/icons";

const schema = yup.object({
  title: yup.string().required("Title harus diisi"),
  description: yup.string().required("Description harus diisi"),
  due_date: yup.string().required("Due date harus diisi"),
  complete: yup.number().required("Complete status harus diisi"),
  id_account: yup.number().required("ID account harus diisi"),
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditTaskForm: React.FC<{
  onClose: () => void;
  taskData: TaskInterface;
  data: TaskInterface[];
}> = ({ taskData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCompleteKeys, setSelectedCompleteKeys] = useState<number>(
    taskData.complete
  );

  const form = useForm<TaskFormInterface>({
    defaultValues: {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      due_date: formatDate(taskData.due_date),
      complete: taskData.complete,
      id_account: taskData.id_account,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = form;

  const handleSelectionCompleteChange = (keys: any) => {
    const key = Array.from(keys)[0];
    setSelectedCompleteKeys(Number(key));
    setValue("complete", Number(key));
  };

  const onSubmitted = async (data: TaskFormInterface) => {
    try {
      setLoading(true);
      await apiUpdateTask(data);
      toast.success(`Data ${data.title} successfully updated.`, {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Unable to update Task", {
        position: "top-center",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
        onClose();
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="font-semibold">Masukkan data baru task:</h2>
      <form
        onSubmit={handleSubmit(onSubmitted)}
        className="w-full flex flex-col gap-6 pt-6"
      >
        {/* Task Title */}
        <div className="flex flex-col w-full md:flex-nowrap md:mb-0 gap-4 relative">
          <Input
            {...register("title")}
            type="text"
            variant="bordered"
            labelPlacement="outside"
            label="Task Title"
            placeholder="Masukkan Judul Task"
            size="lg"
            className="font-semibold"
          />
          <p className="ms-3 text-sm pt-4 text-red-500 min-h-[20px] absolute -bottom-8 right-4 ">
            {errors.title?.message}
          </p>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full md:flex-nowrap md:mb-0 gap-4 relative">
          <Input
            {...register("description")}
            type="text"
            variant="bordered"
            labelPlacement="outside"
            label="Description"
            placeholder="Masukkan Deskripsi"
            size="lg"
            className="font-semibold"
          />
          <p className="ms-3 text-sm pt-4 text-red-500 min-h-[20px] absolute -bottom-8 right-4 ">
            {errors.description?.message}
          </p>
        </div>

        {/* Due Date */}
        <div className="flex flex-col w-full md:flex-nowrap md:mb-0 gap-4 relative">
          <Input
            {...register("due_date")}
            type="datetime-local"
            variant="bordered"
            labelPlacement="outside"
            label="Due Date"
            placeholder="Masukkan tanggal pengumpulan"
            size="lg"
            className="font-semibold"
          />
          <p className="ms-3 text-sm pt-4 text-red-500 min-h-[20px] absolute -bottom-8 right-4 ">
            {errors.due_date?.message}
          </p>
        </div>

        {/* Complete Status */}
        <div className="flex flex-col w-full md:flex-nowrap md:mb-0 gap-4 relative">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="capitalize"
                endContent={<ChevronDownIcon className="text-medium" />}
              >
                {Number(selectedCompleteKeys) === 0 ? "incomplete" : "complete"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-labelledby="dropdown-button"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([selectedCompleteKeys])}
              onSelectionChange={(keys) =>
                handleSelectionCompleteChange(keys as Set<number>)
              }
              className="max-h-[300px] overflow-y-scroll"
            >
              <DropdownItem key={0} value={0}>
                Incomplete
              </DropdownItem>
              <DropdownItem key={1} value={1}>
                Complete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* ID Account */}
        <div className="flex flex-col w-full md:flex-nowrap md:mb-0 gap-4 relative">
          <Input
            {...register("id_account")}
            type="number"
            variant="bordered"
            labelPlacement="outside"
            label="ID Account"
            placeholder="Masukkan id akun"
            size="lg"
            className="font-semibold"
          />
          <p className="ms-3 text-sm pt-4 text-red-500 min-h-[20px] absolute -bottom-8 right-4 ">
            {errors.id_account?.message}
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-6 pb-2">
          <Button
            className="border-1 border-[#092D74] bg-primary min-w-[100px]"
            variant="flat"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={`${
              isValid
                ? "bg-[#092D74] text-primary"
                : "bg-primary-disabled text-primary-disabled"
            } min-w-[100px]`}
            variant="flat"
            size="md"
            type="submit"
            disabled={!isValid}
            isLoading={loading}
          >
            Edit Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
