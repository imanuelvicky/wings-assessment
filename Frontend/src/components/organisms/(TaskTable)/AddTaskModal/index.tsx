import { TaskInterface } from '@interfaces/taskInterface'
import React from 'react'
import AddTaskForm from '../AddTaskForm'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'

const AddTaskModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  data: TaskInterface[]
}> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="bg-[#092D74] text-primary-50 justify-center">{title}</ModalHeader>
        <ModalBody>
          <AddTaskForm onClose={onClose} data={data} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddTaskModal
