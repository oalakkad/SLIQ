import React from "react";
import {
  Box,
  VStack,
  Text,
  Collapse,
  IconButton,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

const RecursiveMenuItem = ({
  item,
  depth = 0,
  onClose,
}: {
  item: any;
  depth?: number;
  onClose: () => void;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isTopLevel = depth === 0;

  return (
    <Box w="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py={2}
        pr={1}
        onClick={hasChildren ? onToggle : undefined}
        cursor={hasChildren ? "pointer" : "default"}
        _hover={{ bg: hasChildren ? "gray.50" : "transparent" }}
      >
        <Link href={item.href} onClick={onClose}>
          <Text
            fontWeight={isTopLevel ? "bold" : "normal"}
            textTransform={isTopLevel ? "uppercase" : "capitalize"}
            fontSize={isTopLevel ? "sm" : "md"}
            fontFamily={
              isTopLevel
                ? "'Readex Pro', sans-serif"
                : "'Work Sans', sans-serif"
            }
            _hover={{ textDecoration: "none" }}
            color="gray.700"
          >
            {item.name}
          </Text>
        </Link>
        {hasChildren && (
          <IconButton
            size="sm"
            aria-label="Toggle submenu"
            icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            variant="ghost"
            color="gray.500"
            _hover={{ bg: "transparent" }}
          />
        )}
      </Box>
      {hasChildren && (
        <Collapse in={isOpen} animateOpacity>
          <VStack align="start" spacing={1} pl={4} py={2}>
            {item.children.map((child: any) => (
              <RecursiveMenuItem
                onClose={onClose}
                key={child.id}
                item={child}
                depth={depth + 1}
              />
            ))}
          </VStack>
        </Collapse>
      )}
      {isTopLevel && <Divider borderColor="gray.200" />}
    </Box>
  );
};

export const HamburgerMenu = ({
  menu,
  onClose,
}: {
  menu: any[];
  onClose: () => void;
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <VStack align="start" spacing={0} w="100%">
      {menu.map((item) => (
        <RecursiveMenuItem key={item.id} item={item} onClose={onClose} />
      ))}
      <Box px={2} py={4}>
        <Link
          href={isAuthenticated ? "/profile" : "/auth/login"}
          color="gray.600"
          onClick={onClose}
        >
          <Text fontSize="md" fontFamily={"'Work Sans', sans-serif"}>
            {isAuthenticated ? "Account" : "Log In"}
          </Text>
        </Link>
      </Box>
    </VStack>
  );
};
