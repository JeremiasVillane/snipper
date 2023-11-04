import { deleteLink } from "@/server-actions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function DeleteLinkModal({
  showModal,
  setShowModal,
  code,
}: {
  showModal: boolean;
  setShowModal: any;
  code: string;
}): JSX.Element {
  const router = useRouter();

  const handleDelete = async (code: string) => {
    await deleteLink(code);
    setShowModal(false);
    router.refresh();
  };

  return (
    <Modal
      isOpen={showModal}
      hideCloseButton
      placement="top-center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Delete Link</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this beautiful link?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => handleDelete(code)}
            >
              Delete
            </Button>
            <Button color="primary" onPress={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
