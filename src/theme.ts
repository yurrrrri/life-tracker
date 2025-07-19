import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    blue: {
      50: "#ffffff",
      100: "#d7caf4ff",
      200: "#b293f3ff",
      300: "#a27df1ff",
      400: "#895ee3ff",
      500: "#7049c4ff",
      600: "#522da1ff",
      700: "#411999ff",
      800: "#381682ff",
      900: "#29096dff",
    },
    brand: {
      50: "#ffffff",
      100: "#d7caf4ff",
      200: "#b293f3ff",
      300: "#a27df1ff",
      400: "#895ee3ff",
      500: "#7049c4ff",
      600: "#522da1ff",
      700: "#411999ff",
      800: "#381682ff",
      900: "#29096dff",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});

export default theme;
