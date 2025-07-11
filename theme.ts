// theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#ffffff",        // --colorBtnPrimary
      primaryText: "#5e5e5e",    // --colorBtnPrimaryText
      primaryDim: "#f2f2f2",     // --colorBtnPrimaryDim
      body: "#ffffff",           // --colorBody
      border: "#e8e8e1",         // --colorBorder
      savings: "#c48c94",        // --colorTextSavings
      price: "#1c1d1d",          // --colorPrice
      announcement: "#feefc4",   // --colorAnnouncement
      modalBg: "#e6e6e6",
      yellow: "#feefc4",        // --colorModalBg
      pink: "#fde4e6",
      lightgrey: "#fafaf9",
      blue: "#d6e4f5",
    },
    gray: {
      50: "#f9f9f9",
      100: "#e0e0e0",
      200: "#c8c8c8",
      300: "#a0a0a0",
      400: "#7e7e7e",
      500: "#5e5e5e", // This is your base gray
      600: "#4b4b4b",
      700: "#3a3a3a",
      800: "#2b2b2b",
      900: "#1c1c1c",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "sm",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        transition: "all 0.4s ease-in-out",
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "brand.primaryText",
          _hover: {
            bg: "brand.primaryDim",
          },
        },
        outline: {
          borderColor: "gray.500",
          color: "brand.primaryText",
          p: "10px 30px",
          fontWeight: "bold",
          _hover: {
            backgroundColor: "gray.500",
            color: "white",
          },
        },
        ghost: {
          bg: "transparent",
          color: "brand.primaryText",
          _hover: {
            bg: "brand.primaryDim",
          },
        },
        solidYellow: {
          bg: "brand.yellow",
          color: "black",
          _hover: {
            bg: "#fbe7a6",
          },
        },
        solidPink: {
          bg: "brand.pink",
          color: "black",
          _hover: {
            bg: "#fbcfd4",
          },
        },
        solidBlue: {
          bg: "brand.blue",
          color: "black",
          _hover: {
            bg: "#c4d9f0",
          },
        },
        outlineYellow: {
          bg: "transparent",
          color: "#5e5e5e",
          border: "1px solid #5e5e5e",
          _hover: {
            bg: "brand.yellow",
            color: "white",
          },
        },
        outlinePink: {
          bg: "transparent",
          color: "#5e5e5e",
          border: "1px solid #5e5e5e",
          _hover: {
            bg: "brand.pink",
            color: "white",
          },
        },
        outlineBlue: {
          bg: "transparent",
          color: "#5e5e5e",
          border: "1px solid #5e5e5e",
          _hover: {
            bg: "brand.blue",
            color: "white",
          },
        },
      },
    },
  },
  fonts: {
    heading: `'Readex Pro', sans-serif`,   // For headings (e.g. <Heading>)
    body: `'Work Sans', sans-serif`,      // For text (e.g. <Text>)
  },
});

export default theme;
