"use client";

import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { NavLink } from "@/components/common";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Box, Flex, Heading, Link, List, ListItem } from "@chakra-ui/react";
import { AnimatedLink } from "../animation/AnimatedLink";
import { AnimatedLinkWithDropdown } from "../animation/AnimatedLinkWithDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  console.log(user);

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      });
  };
  /* Heavenly Hair Milk
Sweet As Pie
Big Effing Clips®
Sweetheart Clips
Super Bloom Clips
Archived Styles*/
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

  const authLinks = (isMobile: boolean) => (
    <>
      <NavLink
        isSelected={isSelected("/dashboard")}
        isMobile={isMobile}
        href="/dashboard"
      >
        Dashboard
      </NavLink>
      <NavLink isMobile={isMobile} onClick={handleLogout}>
        Logout
      </NavLink>
    </>
  );

  const guestLinks = (isMobile: boolean) => (
    <>
      <NavLink
        isSelected={isSelected("/auth/login")}
        isMobile={isMobile}
        href="/auth/login"
      >
        Login
      </NavLink>
      <NavLink
        isSelected={isSelected("/auth/register")}
        isMobile={isMobile}
        href="/auth/register"
      >
        Register
      </NavLink>
    </>
  );

  return (
    <Flex bgColor={"red"} w={"100%"} minH={"60px"} gap={4} pb={6}>
      <Flex flex={1}></Flex>
      <Flex
        flex={2}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Heading as={"h3"} mb={4}>
          SAIE
        </Heading>
        <Flex flexDirection={"row"}>
          {menu.map((item) =>
            item.children ? (
              <AnimatedLinkWithDropdown key={item.id} item={item} />
            ) : (
              <AnimatedLink key={item.id} name={item.name} href={item.href} />
            )
          )}
        </Flex>
      </Flex>
      <Flex flex={1}></Flex>
    </Flex>
  );
}
