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
      modalBg: "#e6e6e6",        // --colorModalBg
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "sm",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
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
          borderColor: "brand.border",
          color: "brand.primaryText",
          _hover: {
            borderColor: "brand.primaryText",
          },
        },
        ghost: {
          bg: "transparent",
          color: "brand.primaryText",
          _hover: {
            bg: "brand.primaryDim",
          },
        },
      },
    },
  },
});

export default theme;
