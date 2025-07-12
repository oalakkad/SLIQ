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

  const menu = [
    { id: "summer", href: "#", name: "Summer Sale", children: null },
    { id: "arrivals", href: "#", name: "New Arrivals", children: null },
    { id: "best", href: "#", name: "Best Sellers", children: null },
    {
      id: "shop",
      href: "#",
      name: "Shop",
      children: [
        {
          id: "featured",
          href: "#",
          name: "Featured",
          children: [
            {
              id: "s-nights",
              href: "#",
              name: "Summer Nights",
              children: null,
            },
            {
              id: "c-ice-brush",
              href: "#",
              name: "Crush Ice Brush",
              children: null,
            },
            {
              id: "starfish",
              href: "#",
              name: "Starfish Clip",
              children: null,
            },
          ],
        },
        {
          id: "clips",
          href: "#",
          name: "Hair Clips",
          children: [
            {
              id: "e-green",
              href: "#",
              name: "Emerald Green",
              children: null,
            },
            {
              id: "r-blue",
              href: "#",
              name: "Royal Blue",
              children: null,
            },
            {
              id: "snights",
              href: "#",
              name: "Summer Nights",
              children: null,
            },
            {
              id: "creme-caramel",
              href: "#",
              name: "Creme Caramel",
              children: null,
            },
            {
              id: "pearly-white",
              href: "#",
              name: "Pearly White",
              children: null,
            },
            {
              id: "pink-lollipop",
              href: "#",
              name: "Pink Lollipop",
              children: null,
            },
            {
              id: "sunset-pink",
              href: "#",
              name: "Sunset Pink",
              children: null,
            },
            { id: "lights-off", href: "#", name: "Lights Off", children: null },
            { id: "snow-white", href: "#", name: "Snow White", children: null },
            { id: "true-white", href: "#", name: "True White", children: null },
            {
              id: "amethyst-haze",
              href: "#",
              name: "Amethyst Haze",
              children: null,
            },
            {
              id: "ballerina-pink",
              href: "#",
              name: "Ballerina Pink",
              children: null,
            },
            { id: "spring-day", href: "#", name: "Spring Day", children: null },
            {
              id: "santorini-blue",
              href: "#",
              name: "Santorini Blue",
              children: null,
            },
            {
              id: "sugar-glaze",
              href: "#",
              name: "Sugar Glaze",
              children: null,
            },
            {
              id: "cotton-candy",
              href: "#",
              name: "Cotton Candy",
              children: null,
            },
            {
              id: "buttercream",
              href: "#",
              name: "Buttercream",
              children: null,
            },
            {
              id: "vanilla-biscuit",
              href: "#",
              name: "Vanilla Biscuit",
              children: null,
            },
            {
              id: "garden-fairy",
              href: "#",
              name: "Garden Fairy",
              children: null,
            },
            { id: "leopard", href: "#", name: "Leopard", children: null },
            { id: "titanic", href: "#", name: "Titanic", children: null },
            {
              id: "puff-pastry",
              href: "#",
              name: "Puff Pastry",
              children: null,
            },
            {
              id: "crushed-ice",
              href: "#",
              name: "Crushed Ice",
              children: null,
            },
            { id: "sweetheart", href: "#", name: "Sweetheart", children: null },
            { id: "mini-clips", href: "#", name: "Mini Clips", children: null },
            {
              id: "pocket-mirror",
              href: "#",
              name: "Pocket Mirror",
              children: null,
            },
          ],
        },
      ],
    },
  ];

  const isSelected = (path: string) => (pathname === path ? true : false);

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
                  <HamburgerMenu menu={menu} />
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
        <Box mt={3}></Box>
        <Image src={saieLogo} alt="SAIE" width={128} height={49} />
        <Flex flexDirection={"row"} mt={3}>
          {!isMobile &&
            menu.map((item) =>
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
        <IconButton
          aria-label="wishlist"
          icon={<PiHeartLight />}
          fontSize={"1.5rem"}
          p={2}
          border={"none"}
          variant={"outlinePink"}
          borderRadius={"50%"}
        />
        <IconButton
          aria-label="cart"
          icon={<SlBag />}
          fontSize={"1.3rem"}
          p={2}
          border={"none"}
          variant={"outlineBlue"}
          borderRadius={"50%"}
        />
      </Flex>
    </Flex>
  );
}
