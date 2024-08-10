'use client'

import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { TaskInterface } from '@interfaces/taskInterface'
import { apiDeleteTaskById } from '@services/api/apiTask'
import { toast } from 'react-toastify'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  taskData: TaskInterface | null
}

const DeleteTaskModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, title, taskData }) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="bg-[#092D74] text-primary-50 justify-center">{title}</ModalHeader>
        <ModalBody>
          {taskData && (
            <div className="flex flex-col gap-2 pt-2">
              <h2>
                Apakah ada yakin akan menghapus task <span className="font-semibold">{taskData.title}</span> ?
              </h2>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="border-1 border-[#092D74] bg-primary min-w-[100px]"
            variant="flat"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            className="min-w-[130px]"
            variant="flat"
            size="md"
            onClick={() => {
              setLoading(true)
              apiDeleteTaskById(taskData?.id || 0)
                .then(() => {
                  toast.success(`Data Task ${taskData?.title} successfully deleted.`, {
                    position: 'top-center',
                  })
                })
                .catch(() => {
                  toast.error(`Unable to delete from Task`, {
                    position: 'top-center',
                  })
                })
                .finally(() => {
                  setTimeout(() => {
                    setLoading(false)
                    onClose()
                    window.location.reload()
                  },2000)
                })
            }}
            isLoading={loading}
          >
            Delete Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteTaskModal
