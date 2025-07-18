import { HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkStyle = {
  _hover: { color: "gray.700" },
  transition: "0.4s all ease-in-out",
};

const accountMenuText = [
  {
    href: "/orders",
    text: "Orders",
  },
  {
    href: "/profile",
    text: "Profile",
  },
];

const AccountMenu = () => {
  const pathname = usePathname();
  return (
    <HStack w={"100%"} justify={"center"} gap={5} fontSize={"lg"} mb={5}>
      {accountMenuText.map((menuText, index) => (
        <Link key={`account-menu-${index}`} href={menuText.href}>
          <Text
            {...linkStyle}
            color={pathname === menuText.href ? "gray.700" : "gray.300"}
          >
            {menuText.text}
          </Text>
        </Link>
      ))}
    </HStack>
  );
};

export default AccountMenu;
