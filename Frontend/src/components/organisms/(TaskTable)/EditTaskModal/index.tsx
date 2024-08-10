import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { TaskInterface } from "@interfaces/taskInterface";
import EditTaskForm from "../EditTaskForm";

const EditTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  taskData: TaskInterface;
  data: TaskInterface[];
}> = ({ isOpen, onClose, title, taskData, data }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="bg-[#092D74] text-primary-50 justify-center">
          {title}
        </ModalHeader>
        <ModalBody>
          <EditTaskForm taskData={taskData} onClose={onClose} data={data} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
