import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { HStack, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout as setLogout } from "@/redux/features/authSlice";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
        queryClient.removeQueries({ queryKey: ["cart"] });
        queryClient.removeQueries({ queryKey: ["wishlist"] });
        router.push("/");
      });
  };
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
      <Text
        {...linkStyle}
        color={"gray.300"}
        onClick={handleLogout}
        cursor={"pointer"}
      >
        Logout
      </Text>
    </HStack>
  );
};

export default AccountMenu;
