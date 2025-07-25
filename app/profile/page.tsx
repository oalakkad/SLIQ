"use client";

import AccountMenu from "@/components/common/AccountMenu";
import AddAddressModal from "@/components/common/AddressModal";
import EditProfileModal from "@/components/common/EditProfileModal";
import { Address, useAddress } from "@/hooks/use-address";
import {
  useRetrieveUserQuery,
  useUpdateUserMutation,
} from "@/redux/features/authApiSlice";
import {
  Box,
  Text,
  Flex,
  IconButton,
  VStack,
  useMediaQuery,
  Button,
  Icon,
  useDisclosure,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { FiPlus, FiInfo } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const {
    data: user,
    refetch,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useRetrieveUserQuery();

  const isArabic = useSelector((state: any) => state.lang.isArabic);

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";
  const [updateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserMutation();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    data: addresses,
    isLoading,
    deleteAddress,
    setDefault,
  } = useAddress();

  return (
    <Box
      bg="#FCF8F7"
      minH="50vh"
      py={10}
      px={[4, 8, 12]}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <AccountMenu />
      <VStack
        align="stretch"
        spacing={6}
        mx="auto"
        bg="white"
        p={6}
        borderRadius="md"
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.600"
            textAlign={isArabic ? "right" : "left"}
            fontStyle={headingFont}
          >
            {isArabic ? "الملف الشخصي" : "PROFILE"}
          </Text>
        </Flex>

        {user ? (
          <>
            <Box
              borderRadius="md"
              p={6}
              bg="#ebf3fc"
              boxShadow="xs"
              w="full"
              position="relative"
            >
              <IconButton
                icon={<MdEdit />}
                size="lg"
                aria-label={isArabic ? "تعديل" : "Edit"}
                position="absolute"
                top={4}
                right={isArabic ? undefined : 4}
                left={isArabic ? 4 : undefined}
                variant="outlineBlue"
                _hover={{ bg: "#c4d9f0", color: "gray.500" }}
                border={"none"}
                onClick={onEditOpen}
                borderRadius={"50%"}
              />
              <VStack
                spacing={3}
                align="start"
                textAlign={isArabic ? "right" : "left"}
              >
                <Box>
                  <Text fontWeight="medium" color="gray.500">
                    {isArabic ? "الاسم" : "Name"}
                  </Text>
                  <Text fontWeight="semibold">
                    {user?.first_name} {user?.last_name}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" color="gray.500">
                    {isArabic ? "البريد الإلكتروني" : "Email"}
                  </Text>
                  <Text fontWeight="semibold">{user?.email}</Text>
                </Box>
              </VStack>
            </Box>

            <EditProfileModal
              isOpen={isEditOpen}
              onClose={onEditClose}
              user={user}
              onSave={(data) => {
                updateUser(data).then(() => refetch());
              }}
            />

            <AddAddressModal isOpen={isOpen} onClose={onClose} />
            <Box bg="white" borderRadius="md" boxShadow="xs" p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  fontFamily="heading"
                  color="black"
                  textAlign={isArabic ? "right" : "left"}
                  fontStyle={headingFont}
                >
                  {isArabic ? "العناوين" : "ADDRESSES"}
                </Text>
                <Button
                  size="sm"
                  leftIcon={<FiPlus />}
                  variant="link"
                  fontWeight="semibold"
                  color="gray.600"
                  onClick={onOpen}
                >
                  {isArabic ? "إضافة" : "Add"}
                </Button>
              </Flex>

              {addresses?.results.length === 0 ? (
                <Box
                  bg="#f5f5f5"
                  borderRadius="md"
                  p={4}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FiInfo} color="gray.500" />
                  <Text color="gray.600">
                    {isArabic
                      ? "لم يتم إضافة أي عنوان بعد"
                      : "No addresses added"}
                  </Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {addresses?.results.map((address: Address) => (
                    <Box
                      key={address.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                      mb={4}
                      position="relative"
                      bg={address.is_default ? "#ebf3fc" : "white"}
                    >
                      <Flex
                        justify="space-between"
                        flexDir={"column"}
                        align="center"
                        w={"100%"}
                      >
                        <HStack
                          w={"100%"}
                          justify={"flex-start"}
                          h={"100%"}
                          align={"flex-start"}
                        >
                          <Box
                            w={"100%"}
                            textAlign={isArabic ? "right" : "left"}
                            fontFamily={bodyFont}
                          >
                            <Text fontWeight="bold">{address.full_name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {address.address_line}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {address.city}, {address.postal_code},{" "}
                              {address.country}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {address.phone}
                            </Text>
                            {address.is_default && (
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color="#6fa0d4ff"
                                mt={2}
                                fontStyle={headingFont}
                              >
                                {isArabic
                                  ? "العنوان الافتراضي"
                                  : "DEFAULT ADDRESS"}
                              </Text>
                            )}
                          </Box>
                          <HStack w={"100%"} justify={"flex-end"} h={"100%"}>
                            {!address.is_default && (
                              <Button
                                size="xs"
                                colorScheme="green"
                                borderRadius="50px"
                                variant="outlineBlue"
                                _hover={{
                                  bg: "#c4d9f0",
                                  color: "gray.500",
                                  borderColor: "#c4d9f0",
                                }}
                                onClick={() => setDefault.mutate(address.id)}
                              >
                                {isArabic ? "تعيين كافتراضي" : "Set as Default"}
                              </Button>
                            )}
                            <IconButton
                              aria-label={isArabic ? "حذف" : "Delete"}
                              icon={<MdDelete />}
                              variant="outlinePink"
                              border="none"
                              _hover={{ color: "gray.500", bg: "#fbcfd4" }}
                              borderRadius="50%"
                              onClick={() => deleteAddress.mutate(address.id)}
                            />
                          </HStack>
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </>
        ) : (
          <Flex justify="center" align="center" h="50vh">
            <Spinner color="brand.pink" size="xl" />
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
