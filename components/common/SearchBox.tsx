"use client";

import {
  Box,
  Flex,
  Input,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Slide,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { CiSearch } from "react-icons/ci";
import { useRef, useEffect } from "react";

export default function SearchPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const Content = (
    <Box
      bg="white"
      w="full"
      px={{ base: 4, md: 20 }}
      py={{ base: 3, md: 8 }}
      boxShadow="0 20px 50px rgba(0, 0, 0, 0.6)"
    >
      <Flex justify="space-between" align="center">
        <Flex flex={1} align="center" gap={4}>
          <CiSearch size={28} color="gray" cursor={"pointer"} />
          <Input
            ref={inputRef}
            variant="unstyled"
            placeholder="Search our store"
            border={"none"}
            fontSize="lg"
            color="gray.700"
            fontFamily={"'Work Sans', sans-serif"}
            _focus={{ border: "none", boxShadow: "none" }}
            _placeholder={{ color: "gray.400" }}
          />
        </Flex>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close search"
          variant="link"
          onClick={onClose}
          size="md"
        />
      </Flex>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay>
          {isOpen && (
            <Box
              position="fixed"
              top={0}
              left={0}
              w="100vw"
              h="50vh"
              bg="white"
              onClick={onClose}
              opacity={0.3}
              zIndex={0}
            />
          )}
        </DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} zIndex={1} mt={10}>
            {Content}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return isOpen ? (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="white"
        onClick={onClose}
        opacity={0.8}
        zIndex={998}
      />
      <Slide direction="top" in={isOpen} style={{ zIndex: 999 }}>
        {Content}
      </Slide>
    </>
  ) : null;
}
