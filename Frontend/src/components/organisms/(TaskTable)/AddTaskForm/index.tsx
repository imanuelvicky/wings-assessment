"use client";

import { TaskFormInterface, TaskInterface } from "@interfaces/taskInterface";
import * as yup from "yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { apiPostTask } from "@services/api/apiTask";
import { toast } from "react-toastify";
import { ChevronDownIcon } from "@assets/icons";

const schema = yup.object({
  title: yup.string().required("Title harus diisi"),
  description: yup.string().required("Description harus diisi"),
  due_date: yup.string().required("Due date harus diisi"),
  complete: yup.number().required("Complete status harus diisi"),
  id_account: yup.number().required("ID account harus diisi"),
});

export default function AddTaskForm({
  onClose,
}: Readonly<{
  onClose: () => void;
  data: TaskInterface[];
}>) {
  const [loading, setLoading] = useState(false);
  const [selectedCompleteKeys, setSelectedCompleteKeys] = useState<number>(0);

  const form = useForm<TaskFormInterface>({
    defaultValues: {
      title: "",
      description: "",
      due_date: "",
      complete: 0,
      id_account: 0,
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

  const handleSelectionCompleteChange = (keys: Set<number>) => {
    const key = Array.from(keys)[0] as number;
    setSelectedCompleteKeys(key);
    setValue("complete", key);
    console.log(selectedCompleteKeys);
  };

  const onSubmitted = async (data: TaskFormInterface) => {
    try {
      setLoading(true);
      await apiPostTask(data);
      toast.success(`Data ${data.title} successfully submitted.`, {
        position: "top-center",
      });
    } finally {
      toast.success(`Data ${data.title} successfully submitted.`, {
        position: "top-center",
      });
      setTimeout(() => {
        setLoading(false);
        onClose();
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2>Masukkan data task:</h2>
      <form
        onSubmit={handleSubmit(onSubmitted)}
        className="w-full flex flex-col gap-6 pt-6"
      >
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
              selectedKeys={new Set([selectedCompleteKeys])} // Convert selected key to Set
              onSelectionChange={(keys) =>
                handleSelectionCompleteChange(keys as Set<number>)
              } // Handle selection change
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
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
}
