import React, { useEffect } from "react";
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
  NumberInput,
  NumberInputField,
  Checkbox,
  VStack,
  HStack,
  Select,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { AdminAddon } from "@/hooks/use-admin-addons";
import { useAdminAddonCategories } from "@/hooks/use-admin-addon-categories";

// Validation Schema
const AddonSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().min(0, "Must be >= 0").required("Required"),
  category_ids: Yup.array().of(Yup.number()).nullable().default([]),
  options: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Required"),
      price: Yup.number().min(0, "Must be >= 0"),
    })
  ),
});

interface EditAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  addon?: any | null;
  onSubmit: (data: any) => void;
}

export const EditAddonModal: React.FC<EditAddonModalProps> = ({
  isOpen,
  onClose,
  addon,
  onSubmit,
}) => {
  const { categories, isLoading } = useAdminAddonCategories();
  console.log(addon);
  const initialValues = {
    name: addon?.name || "",
    name_ar: addon?.name_ar || "",
    price: addon?.price || 0,
    requires_custom_name: addon?.requires_custom_name || false,
    allow_multiple_options: addon?.allow_multiple_options || false,
    category_ids:
      addon?.category_ids ?? addon?.categories?.map((c: any) => c.id) ?? [],
    options: addon?.options || [],
  };

  console.log(initialValues.category_ids);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{addon ? "Edit Addon" : "Create Addon"}</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialValues}
          validationSchema={AddonSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
          enableReinitialize
        >
          {({ values, errors, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  {/* Name */}
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Name (EN)</FormLabel>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>

                  {/* Name AR */}
                  <FormControl>
                    <FormLabel>Name (AR)</FormLabel>
                    <Input
                      name="name_ar"
                      value={values.name_ar}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormControl>

                  {/* Price */}
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <NumberInput
                      value={values.price}
                      onChange={(_, val) => setFieldValue("price", val)}
                      min={0}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  {/* Categories */}
                  <FormControl isInvalid={!!errors.category_ids}>
                    <FormLabel>Categories</FormLabel>
                    <Select
                      multiple
                      value={values.category_ids.map(String)}
                      onChange={(e) => {
                        const selected = Array.from(
                          e.target.selectedOptions,
                          (opt) => Number(opt.value)
                        );
                        setFieldValue("category_ids", selected);
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Flags */}
                  <HStack>
                    <Checkbox
                      isChecked={values.requires_custom_name}
                      onChange={(e) =>
                        setFieldValue("requires_custom_name", e.target.checked)
                      }
                    >
                      Requires Custom Name
                    </Checkbox>
                    <Checkbox
                      isChecked={values.allow_multiple_options}
                      onChange={(e) =>
                        setFieldValue(
                          "allow_multiple_options",
                          e.target.checked
                        )
                      }
                    >
                      Allow Multiple Options
                    </Checkbox>
                  </HStack>

                  {/* Options */}
                  <FormControl>
                    <FormLabel>Options</FormLabel>
                    <FieldArray name="options">
                      {({ push, remove }) => (
                        <VStack spacing={3} align="stretch">
                          {values.options.map((opt: any, i: number) => (
                            <HStack key={i} spacing={2}>
                              <Input
                                placeholder="Name"
                                name={`options.${i}.name`}
                                value={opt.name}
                                onChange={handleChange}
                              />
                              <Input
                                placeholder="الاسم"
                                name={`options.${i}.name_ar`}
                                value={opt.name_ar}
                                onChange={handleChange}
                                dir="rtl"
                              />
                              <NumberInput
                                value={opt.price}
                                onChange={(_, val) =>
                                  setFieldValue(`options.${i}.price`, val)
                                }
                                min={0}
                              >
                                <NumberInputField />
                              </NumberInput>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => remove(i)}
                              >
                                Remove
                              </Button>
                            </HStack>
                          ))}
                          <Button
                            size="sm"
                            onClick={() =>
                              push({ name: "", name_ar: "", price: 0 })
                            }
                          >
                            + Add Option
                          </Button>
                        </VStack>
                      )}
                    </FieldArray>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  {addon ? "Save Changes" : "Create Addon"}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
