import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AdminAddonCategory,
  useAdminAddonCategories,
} from "@/hooks/use-admin-addon-categories";

interface Props {
  category?: AdminAddonCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditAddonCategoryModal({
  category,
  isOpen,
  onClose,
}: Props) {
  const { createAddonCategory, updateAddonCategory } =
    useAdminAddonCategories();

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      name_ar: category?.name_ar || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values) => {
      if (category) {
        await updateAddonCategory.mutateAsync({
          id: category.id,
          data: values,
        });
      } else {
        await createAddonCategory.mutateAsync(values);
      }
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {category ? "Edit Addon Category" : "Add Addon Category"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Name (Arabic)</FormLabel>
              <Input
                name="name_ar"
                value={formik.values.name_ar}
                onChange={formik.handleChange}
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={() => formik.handleSubmit()}>
            {category ? "Save Changes" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
