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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { setArabic, setEnglish } from "@/redux/features/langSlice";

const RecursiveMenuItem = ({
  item,
  depth = 0,
  onClose,
  onClick,
  fontStyle,
}: {
  item: any;
  depth?: number;
  onClose: () => void;
  onClick?: () => void;
  fontStyle?: string;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isTopLevel = depth === 0;
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  return (
    <Box w="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py={2}
        pr={1}
        onClick={
          onClick !== undefined
            ? () => {
                onClick();
                onClose();
              }
            : hasChildren
            ? onToggle
            : undefined
        }
        cursor={"pointer"}
        _hover={{ bg: hasChildren ? "gray.50" : "transparent" }}
      >
        <Link href={item.href} onClick={onClose}>
          <Text
            fontWeight={isTopLevel ? "bold" : "normal"}
            textTransform={isTopLevel ? "uppercase" : "capitalize"}
            fontSize={isTopLevel ? "sm" : "md"}
            fontFamily={
              fontStyle !== undefined
                ? fontStyle
                : isTopLevel
                ? headingFont
                : bodyFont
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
  const { isOpen: isAccountOpen, onToggle: onAccountToggle } = useDisclosure();
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const dispatch = useAppDispatch();

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  return (
    <VStack align="start" spacing={0} w="100%">
      {menu.map((item) => (
        <RecursiveMenuItem key={item.id} item={item} onClose={onClose} />
      ))}
      <Box w="100%">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          pr={1}
          onClick={onAccountToggle}
          cursor={"pointer"}
          _hover={{ bg: "gray.50" }}
        >
          <Link
            href={isAuthenticated ? "/profile" : "/auth/login"}
            onClick={onClose}
          >
            <Text
              fontWeight={"bold"}
              textTransform={"capitalize"}
              fontSize={"sm"}
              fontFamily={"'Readex Pro', sans-serif"}
              _hover={{ textDecoration: "none" }}
              color="gray.700"
            >
              {isAuthenticated
                ? isArabic
                  ? "الحساب"
                  : "Account"
                : isArabic
                ? "تسجيل الدخول"
                : "Login"}
            </Text>
          </Link>
          {isAuthenticated && (
            <IconButton
              size="sm"
              aria-label="Toggle submenu"
              icon={isAccountOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              variant="ghost"
              color="gray.500"
              _hover={{ bg: "transparent" }}
            />
          )}
        </Box>
        {isAuthenticated && (
          <>
            <Collapse in={isAccountOpen} animateOpacity>
              <VStack align="start" spacing={1} pl={4} py={2}>
                <RecursiveMenuItem
                  onClose={onClose}
                  item={{
                    href: "/orders",
                    name: isArabic ? "الطلبات" : "Orders",
                  }}
                  depth={1}
                />
                <RecursiveMenuItem
                  onClose={onClose}
                  item={{ href: "/profile", name: "الحساب الشخصي" }}
                  depth={1}
                />
              </VStack>
            </Collapse>
            <Divider borderColor="gray.200" />
          </>
        )}
      </Box>
      <RecursiveMenuItem
        onClose={onClose}
        fontStyle={
          isArabic
            ? "var(--font-readex-pro), sans-serif"
            : "var(--font-cairo), sans-serif"
        }
        onClick={
          isArabic ? () => dispatch(setEnglish()) : () => dispatch(setArabic())
        }
        item={{
          href: "",
          name: isArabic ? "English" : "العربية",
        }}
        depth={1}
      />
    </VStack>
  );
};
