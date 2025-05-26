import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export (existing tokens)
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#ed1c24",
          600: "#d01920",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#ed1c24",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        purpleAccent: {
          100: "#eadaf7",
          200: "#d5b5ef",
          300: "#c090e8",
          400: "#ab6be0",
          500: "#9747d9",
          600: "#7939ad",
          700: "#5b2b82",
          800: "#3c1d56",
          900: "#1e0e2b",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
        orangeAccent: {
          100: "#fff4e5",
          200: "#ffe0b2",
          300: "#ffcc80",
          400: "#ffb74d",
          500: "#ffa726",
          600: "#fb8c00",
          700: "#ef6c00",
          800: "#e65100",
          900: "#bf360c",
        },
        yellowAccent: {
          100: "#fffde7",
          200: "#fff9c4",
          300: "#fff59d",
          400: "#fff176",
          500: "#ffee58",
          600: "#fdd835",
          700: "#fbc02d",
          800: "#f9a825",
          900: "#f57f17",
        },
        cyanAccent: {
          100: "#e0f7fa",
          200: "#b2ebf2",
          300: "#80deea",
          400: "#4dd0e1",
          500: "#26c6da",
          600: "#00acc1",
          700: "#0097a7",
          800: "#00838f",
          900: "#006064",
        },
        pinkAccent: {
          100: "#fce4ec",
          200: "#f8bbd9",
          300: "#f48fb1",
          400: "#f06292",
          500: "#ec407a",
          600: "#e91e63",
          700: "#c2185b",
          800: "#ad1457",
          900: "#880e4f",
        },
        indigoAccent: {
          100: "#e8eaf6",
          200: "#c5cae9",
          300: "#9fa8da",
          400: "#7986cb",
          500: "#5c6bc0",
          600: "#3f51b5",
          700: "#3949ab",
          800: "#303f9f",
          900: "#283593",
        },
        lightGreenAccent: {
          100: "#f1f8e9",
          200: "#dcedc8",
          300: "#c5e1a5",
          400: "#aed581",
          500: "#9ccc65",
          600: "#8bc34a",
          700: "#689f38",
          800: "#558b2f",
          900: "#33691e",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#ed1c24",
          600: "#d01920",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        orangeAccent: {
          100: "#bf360c",
          200: "#e65100",
          300: "#ef6c00",
          400: "#fb8c00",
          500: "#ffa726",
          600: "#ffb74d",
          700: "#ffcc80",
          800: "#ffe0b2",
          900: "#fff4e5",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#ed1c24",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        purpleAccent: {
          100: "#1e0e2b",
          200: "#3c1d56",
          300: "#5b2b82",
          400: "#7939ad",
          500: "#9747d9",
          600: "#ab6be0",
          700: "#c090e8",
          800: "#d5b5ef",
          900: "#eadaf7",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
        yellowAccent: {
          100: "#f57f17",
          200: "#f9a825",
          300: "#fbc02d",
          400: "#fdd835",
          500: "#ffee58",
          600: "#fff176",
          700: "#fff59d",
          800: "#fff9c4",
          900: "#fffde7",
        },
        cyanAccent: {
          100: "#006064",
          200: "#00838f",
          300: "#0097a7",
          400: "#00acc1",
          500: "#26c6da",
          600: "#4dd0e1",
          700: "#80deea",
          800: "#b2ebf2",
          900: "#e0f7fa",
        },
        pinkAccent: {
          100: "#880e4f",
          200: "#ad1457",
          300: "#c2185b",
          400: "#e91e63",
          500: "#ec407a",
          600: "#f06292",
          700: "#f48fb1",
          800: "#f8bbd9",
          900: "#fce4ec",
        },
        indigoAccent: {
          100: "#283593",
          200: "#303f9f",
          300: "#3949ab",
          400: "#3f51b5",
          500: "#5c6bc0",
          600: "#7986cb",
          700: "#9fa8da",
          800: "#c5cae9",
          900: "#e8eaf6",
        },
        lightGreenAccent: {
          100: "#33691e",
          200: "#558b2f",
          300: "#689f38",
          400: "#8bc34a",
          500: "#9ccc65",
          600: "#aed581",
          700: "#c5e1a5",
          800: "#dcedc8",
          900: "#f1f8e9",
        },
      }),
});

// MUI theme settings extended to include custom typography options
export const themeSettings = (mode, customizations = {}) => {
  const colors = tokens(mode);
  const { fontFamily, fontSize } = customizations;
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: { main: colors.primary[500] },
            secondary: { main: colors.greenAccent[500] },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[400],
              paper: colors.primary[700],
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[300],
            },
          }
        : {
            primary: { main: colors.primary[500] },
            secondary: { main: colors.greenAccent[500] },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: { default: "#fcfcfc" },
          }),
    },
    typography: {
      fontFamily: fontFamily || ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: fontSize || 12,
      h1: { fontFamily: fontFamily, fontSize: 40 },
      h2: { fontFamily: fontFamily, fontSize: 32 },
      h3: { fontFamily: fontFamily, fontSize: 24 },
      h4: { fontFamily: fontFamily, fontSize: 20 },
      h5: { fontFamily: fontFamily, fontSize: 16 },
      h6: { fontFamily: fontFamily, fontSize: 14 },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            ...(mode === 'dark' && {
              '& label': {
                color: colors.grey[300],
              },
              '& label.Mui-focused': {
                color: colors.greenAccent[400],
              },
              '& .MuiInputBase-input': {
                color: colors.grey[100],
                backgroundColor: colors.primary[700], // Explicit input background
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary[700], // Explicit input background
                '& fieldset': {
                  borderColor: colors.grey[600],
                },
                '&:hover fieldset': {
                  borderColor: colors.greenAccent[700],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.greenAccent[500],
                },
                // Webkit autofill override
                '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active': {
                  WebkitBoxShadow: `0 0 0 30px ${colors.primary[700]} inset !important`,
                  WebkitTextFillColor: `${colors.grey[100]} !important`,
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: colors.grey[400], // Adjusted placeholder color
                opacity: 1,
              },
            }),
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            ...(mode === 'dark' && {
              '&.MuiOutlinedInput-root': { // Target the root of the Select's input appearance
                backgroundColor: colors.primary[700],
                '& fieldset': {
                  borderColor: colors.grey[600],
                },
                '&:hover fieldset': {
                  borderColor: colors.greenAccent[700],
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.greenAccent[500],
                },
              },
              '& .MuiSelect-select': {
                color: colors.grey[100],
              },
              '& .MuiSvgIcon-root': { // Dropdown icon
                color: colors.grey[300],
              },
            }),
          },
        },
      },
      MuiMenuItem: { // For Select dropdown items
        styleOverrides: {
          root: {
            ...(mode === 'dark' && {
              color: colors.grey[100],
              backgroundColor: colors.primary[700], // Background of menu items
              '&:hover': {
                backgroundColor: colors.primary[600],
              },
              '&.Mui-selected': {
                backgroundColor: `${colors.greenAccent[700]} !important`,
                color: colors.grey[100],
              },
              '&.Mui-selected:hover': {
                backgroundColor: `${colors.greenAccent[600]} !important`,
              }
            }),
          }
        }
      },
      MuiMenu: { // For the Paper element wrapping MenuItems
        styleOverrides: {
          paper: {
            ...(mode === 'dark' && {
              backgroundColor: colors.primary[700], // Background of the dropdown itself
            }),
          }
        }
      }
    }
  };
};

// Create a context that is extensible to include more customization
export const ThemeCustomizationContext = createContext({
  toggleColorMode: () => {},
  updateCustomization: (customizations) => {},
});

// Custom hook to manage theme mode and additional customizations
export const useMode = () => {
  // Retrieve persisted settings from localStorage or use defaults
  const storedMode = localStorage.getItem("userMode") || "dark";
  const storedFontFamily = localStorage.getItem("fontFamily") || "";
  const storedFontSize = localStorage.getItem("fontSize") || "";
  const initialCustomizations = {
    fontFamily: storedFontFamily || undefined,
    fontSize: storedFontSize ? Number(storedFontSize) : undefined,
  };

  const [mode, setMode] = useState(storedMode);
  const [customizations, setCustomizations] = useState(initialCustomizations);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const newMode = prev === "light" ? "dark" : "light";
          localStorage.setItem("userMode", newMode);
          return newMode;
        });
      },
      updateCustomization: (newCustomizations) => {
        setCustomizations((prev) => {
          const updated = { ...prev, ...newCustomizations };
          if (updated.fontFamily) {
            localStorage.setItem("fontFamily", updated.fontFamily);
          }
          if (updated.fontSize) {
            localStorage.setItem("fontSize", updated.fontSize);
          }
          return updated;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () => createTheme(themeSettings(mode, customizations)),
    [mode, customizations]
  );
  return [theme, colorMode];
};