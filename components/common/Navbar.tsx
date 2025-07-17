"use client";

import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { AnimatedLink } from "../animation/AnimatedLink";
import { AnimatedLinkWithDropdown } from "../animation/AnimatedLinkWithDropdown";
import { SlUser } from "react-icons/sl";
import { PiHeartLight } from "react-icons/pi";
import { SlBag } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import saieLogo from "@/public/saie-logo.png";
import { HamburgerMenu } from "./HamburgerMenu";
import { HamburgerIcon } from "@chakra-ui/icons";
import SearchBox from "./SearchBox";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useMenuCategories } from "@/hooks/use-menu-categories";
import { buildDynamicMenu } from "./BuildDynamicMenu";
import { useMemo } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isMobile] = useMediaQuery(["(max-width: 950px)"]);

  // const {
  //   data: cart,
  //   isLoading: isCartLoading,
  //   isError: isCartError,
  // } = useCart();

  // console.log(cart);

  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  // console.log(user ?? "");

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      });
  };
  console.log(isAuthenticated);

  const { data: categories } = useMenuCategories();

  const baseMenu = [
    { id: "summer", href: "#", name: "Summer Sale", children: null },
    { id: "arrivals", href: "#", name: "New Arrivals", children: null },
    { id: "best", href: "#", name: "Best Sellers", children: null },
    {
      id: "shop",
      href: "/shop",
      name: "Shop",
      children: [], // will populate dynamically
    },
  ];

  const dynamicMenu = useMemo(() => {
    if (!categories) return baseMenu;

    const { shopChildren } = buildDynamicMenu(categories);

    const updatedMenu = baseMenu.map((item) => {
      if (item.id === "shop") {
        return {
          ...item,
          children: shopChildren,
        };
      }
      return item;
    });

    return updatedMenu;
  }, [categories]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  return (
    <Flex
      bgColor={"white"}
      w={"100%"}
      minH={"60px"}
      gap={4}
      pb={6}
      pt={2}
      px={isMobile ? 2 : "100px"}
    >
      <SearchBox isOpen={isSearchOpen} onClose={onSearchClose} />
      <Flex flex={1} justifyContent={"flex-start"} alignItems={"center"}>
        {!isMobile && (
          <IconButton
            aria-label="search"
            icon={<CiSearch />}
            fontSize={"1.7rem"}
            variant={"link"}
            borderRadius={"50%"}
            _hover={{ color: "gray.300" }}
            onClick={onSearchOpen}
          />
        )}
        {isMobile && (
          <>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              onClick={onOpen}
              variant="variant"
              fontSize={"xl"}
              _hover={{ color: "gray.300" }}
            />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent maxW="320px" pt={6}>
                <DrawerCloseButton top={4} right={4} />
                <DrawerBody px={4}>
                  <HamburgerMenu menu={dynamicMenu} onClose={onClose} />
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </Flex>
      <Flex
        flex={2}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box mt={4}></Box>
        <Link href={"/"}>
          <Image src={saieLogo} alt="SAIE" width={128} height={49} />
        </Link>
        <Flex flexDirection={"row"} mt={5}>
          {!isMobile &&
            dynamicMenu.map((item) =>
              item.children ? (
                <AnimatedLinkWithDropdown key={item.id} item={item} />
              ) : (
                <AnimatedLink
                  fontColor={"gray.600"}
                  key={item.id}
                  name={item.name}
                  href={item.href}
                />
              )
            )}
        </Flex>
      </Flex>
      <Flex flex={1} justifyContent={"flex-end"} alignItems={"center"} gap={1}>
        {isMobile && (
          <IconButton
            aria-label="search"
            icon={<CiSearch />}
            fontSize={"1.5rem"}
            p={2}
            border={"none"}
            variant={"outlineYellow"}
            onClick={onSearchOpen}
            borderRadius={"50%"}
          />
        )}
        {!isMobile && (
          <Link href={isAuthenticated ? "/profile" : "/auth/login"}>
            <IconButton
              aria-label="user-profile"
              icon={<SlUser />}
              fontSize={"1.3rem"}
              p={2}
              border={"none"}
              variant={"outlineYellow"}
              borderRadius={"50%"}
            />
          </Link>
        )}
        <Link href={isAuthenticated ? "/wishlist" : "/auth/login"}>
          <IconButton
            aria-label="wishlist"
            icon={<PiHeartLight />}
            fontSize={"1.5rem"}
            p={2}
            border={"none"}
            variant={"outlinePink"}
            borderRadius={"50%"}
          />
        </Link>
        <Link href={isAuthenticated ? "/cart" : "/auth/login"}>
          <IconButton
            aria-label="cart"
            icon={<SlBag />}
            fontSize={"1.3rem"}
            p={2}
            border={"none"}
            variant={"outlineBlue"}
            borderRadius={"50%"}
          />
        </Link>
      </Flex>
    </Flex>
  );
}
