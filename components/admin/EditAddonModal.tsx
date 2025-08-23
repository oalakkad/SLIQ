import React, { useMemo } from "react";
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
  IconButton,
  // ⛔ remove Chakra's Select import to avoid name clash
  // Select,
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useAdminAddonCategories } from "@/hooks/use-admin-addon-categories";
import ReactSelect, { MultiValue } from "react-select";
import { FaTrash } from "react-icons/fa";
import theme from "@/theme";

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

type Option = { value: number; label: string };

export const EditAddonModal: React.FC<EditAddonModalProps> = ({
  isOpen,
  onClose,
  addon,
  onSubmit,
}) => {
  const { categories, isLoading } = useAdminAddonCategories();

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

  // Build options once from categories
  const categoryOptions: Option[] = useMemo(
    () =>
      (categories ?? []).map((cat: any) => ({
        value: cat.id,
        label: cat.name_ar ? `${cat.name} / ${cat.name_ar}` : cat.name,
      })),
    [categories]
  );

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
          {({ values, errors, handleChange, handleBlur, setFieldValue }) => {
            // Map current numeric ids -> react-select options
            const selectedOptions: Option[] = categoryOptions.filter((opt) =>
              values.category_ids.includes(opt.value)
            );

            return (
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

                    {/* Categories (react-select multi) */}
                    <FormControl isInvalid={!!errors.category_ids}>
                      <FormLabel>Categories</FormLabel>
                      <ReactSelect
                        classNamePrefix="rs"
                        isMulti
                        isSearchable
                        isClearable
                        closeMenuOnSelect={false}
                        options={categoryOptions}
                        value={selectedOptions}
                        onChange={(opts: MultiValue<Option>) =>
                          setFieldValue(
                            "category_ids",
                            (opts as Option[]).map((o) => o.value)
                          )
                        }
                        placeholder="Select categories..."
                        isLoading={isLoading}
                        // Make sure the menu renders above Chakra Modal
                        menuPortalTarget={
                          typeof document !== "undefined"
                            ? document.body
                            : undefined
                        }
                        styles={{
                          // 🔹 merge both control customizations
                          control: (base, state) => ({
                            ...base,
                            minHeight: 42, // from second config
                            borderColor: state.isFocused
                              ? theme.colors.brandBlue[500]
                              : theme.colors.gray[300],
                            boxShadow: state.isFocused
                              ? `0 0 0 1px ${theme.colors.brandBlue[500]}`
                              : undefined,
                            "&:hover": {
                              borderColor: theme.colors.brandBlue[400],
                            },
                          }),

                          // 🔹 option styling (from first config)
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? theme.colors.brandBlue[500]
                              : state.isFocused
                              ? theme.colors.brandBlue[100]
                              : "white",
                            color: state.isSelected ? "white" : "black",
                            cursor: "pointer",
                          }),

                          // 🔹 multi-value styles (from first config)
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: theme.colors.brandBlue[100],
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: theme.colors.brandBlue[700],
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: theme.colors.brandBlue[500],
                            ":hover": {
                              backgroundColor: theme.colors.brandBlue[500],
                              color: "white",
                            },
                          }),

                          // 🔹 menuPortal (from second config)
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),

                          // 🔹 valueContainer (from second config)
                          valueContainer: (base) => ({
                            ...base,
                            paddingTop: 6,
                            paddingBottom: 6,
                          }),
                        }}
                      />
                    </FormControl>

                    {/* Flags */}
                    <HStack>
                      <Checkbox
                        isChecked={values.requires_custom_name}
                        onChange={(e) =>
                          setFieldValue(
                            "requires_custom_name",
                            e.target.checked
                          )
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
                                <IconButton
                                  aria-label="remove-addon"
                                  size="sm"
                                  colorScheme="red"
                                  icon={<FaTrash />}
                                  onClick={() => remove(i)}
                                >
                                  Remove
                                </IconButton>
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
                  <Button colorScheme="brandPink" type="submit">
                    {addon ? "Save Changes" : "Create Addon"}
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
