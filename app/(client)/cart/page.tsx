"use client";

import { useMediaQuery } from "@chakra-ui/react";
import DesktopCart from "@/components/common/DesktopCart";
import MobileCart from "@/components/common/MobileCart";

export default function Cart() {
  const [isLargerThan768] = useMediaQuery("(min-width: 950px)");

  return isLargerThan768 ? <DesktopCart /> : <MobileCart />;
}
