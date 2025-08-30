"use client";

import { useCart } from "@/hooks/use-cart";
import { useAppSelector } from "@/redux/hooks";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Stack,
  Badge,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DesktopCart() {
  useEffect(() => {
    // Dynamically load the script tag for the widget
    const script = document.createElement("script");
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const isArabic = useAppSelector((state) => state.lang.isArabic);

  return (
    <Box w={"100%"}>
      <Heading textAlign={"center"} my={5} color={"gray.600"}>
        {isArabic ? "سجل الصور" : "LOOKBOOK"}
      </Heading>
      <div style={{ width: "100%" }}>
        <iframe
          src="//lightwidget.com/widgets/476b5dfcb2b1542d9501b8bca005a792.html"
          scrolling="no"
          allowTransparency={true}
          className="lightwidget-widget"
          style={{ width: "100%", border: 0, overflow: "hidden" }}
        ></iframe>
      </div>
    </Box>
  );
}
