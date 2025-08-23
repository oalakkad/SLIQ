// theme.ts
import { defineStyleConfig, extendTheme } from "@chakra-ui/react";

export const Radio = defineStyleConfig({
  baseStyle: {
    control: {
      borderRadius: "md", // square shape
      _checked: {
        bg: "brand.blue",       // background color when selected
        borderColor: "brand.blue",
        color: "white",

        // remove the inner dot
         _before: {
          content: "none",
        },
      },
    },
  },
});

export const Checkbox = defineStyleConfig({
  baseStyle: {
    control: {
      borderRadius: "md", // square edges (use "full" for rounded)
      _checked: {
        bg: "brand.blue",       // background color when checked
        borderColor: "brand.blue",
        color: "white",       // tick color (default is white)
        _hover: {
          bg: "brandBlue.600",
          borderColor: "brandBlue.600",
        },
      },
    },
  },
});

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
    brandYellow: {
    50:  "#fffdf6",
    100: "#fff9e8",
    200: "#fff3d1",
    300: "#ffeab0",
    400: "#ffe18f",
    500: "#feefc4", // base
    600: "#e5d6ab",
    700: "#b8aa85",
    800: "#8a7f60",
    900: "#5c543b",
  },
  brandPink: {
    50:  "#fff7f8",
    100: "#ffedef",
    200: "#ffdadf",
    300: "#ffc7cf",
    400: "#ffb3bf",
    500: "#fde4e6", // base
    600: "#e4cbcd",
    700: "#b5a0a1",
    800: "#867575",
    900: "#574b4a",
  },
  brandPink2: {
      50:  "#fff7f8",
      100: "#ffedef",
      200: "#ffdadf",
      300: "#ffc7cf",
      400: "#ffb3bf",
      500: "#ff9bab", // make this your BASE (main) shade
      600: "#e68292",
      700: "#b56671",
      800: "#864a50",
      900: "#572d30",
    },
  brandLightGrey: {
    50:  "#ffffff",
    100: "#fdfdfd",
    200: "#f8f8f7",
    300: "#f4f4f3",
    400: "#f0f0ef",
    500: "#fafaf9", // base
    600: "#e1e1e0",
    700: "#b3b3b3",
    800: "#858585",
    900: "#575757",
  },
  brandBlue: {
    50:  "#f6f9fd",
    100: "#edf3fa",
    200: "#e3ecf7",
    300: "#d9e5f3",
    400: "#cfddf0",
    500: "#d6e4f5", // base
    600: "#bdcbdb",
    700: "#97a2ac",
    800: "#71797e",
    900: "#4b5050",
  },
  },
  components: {
    Checkbox,
    Radio,
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "sm",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        transition: "all 0.4s ease-in-out",
      },
      variants: {
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
            border: "1px solid #feefc4",
          },
        },
        outlinePink: {
          bg: "transparent",
          color: "#5e5e5e",
          border: "1px solid #5e5e5e",
          _hover: {
            bg: "brand.pink",
            color: "white",
            border: "1px solid #fde4e6",
          },
        },
        outlineBlue: {
          bg: "transparent",
          color: "#5e5e5e",
          border: "1px solid #5e5e5e",
          _hover: {
            bg: "brand.blue",
            color: "white",
            border: "1px solid #d6e4f5",
          },
        },
      },
    },
  },
  fonts: {
    heading: 'var(--font-readex-pro), sans-serif',
    body: 'var(--font-work-sans), sans-serif',
  },
});

export default theme;
