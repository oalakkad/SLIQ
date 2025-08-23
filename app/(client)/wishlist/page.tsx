"use client";

import { useMediaQuery } from "@chakra-ui/react";
import DesktopWishlist from "@/components/common/DesktopWishlist";
import MobileWishlist from "@/components/common/MobileWishlist";

export default function Wishlist() {
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");

  return isLargerThan950 ? <DesktopWishlist /> : <MobileWishlist />;
}
