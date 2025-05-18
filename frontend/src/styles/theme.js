import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0", // Lightest grey for text
          200: "#c2c2c2",
          300: "#a3a3a3", // Secondary text, placeholder
          400: "#858585",
          500: "#666666", // Borders
          600: "#525252", // Darker borders, hover states
          700: "#3d3d3d", // Input field background
          800: "#292929", // Card/container backgrounds
          900: "#141414", // Deepest background
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40", // Main background for sections like dialogs, search bar container
          500: "#ed1c24", // Main brand red
          600: "#d01920",
          700: "#0c101b", // Can be used for input backgrounds if distinct from primary[400]
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd", // Focused label, hover borders
          500: "#4cceac", // Main accent, focused borders
          600: "#3da58a",
          700: "#2e7c67", // Darker accent for backgrounds or selected items
          800: "#1e5245",
          900: "#0f2922", // Chip background for admin
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#ed1c24", // Main red accent
          600: "#af3f3b",
          700: "#832f2c", // Darker red for hovers/borders
          800: "#58201e",
          900: "#2c100f",
        },
        purpleAccent: { // New color for Agent type
          100: "#eadaf7",
          200: "#d5b5ef",
          300: "#c090e8",
          400: "#ab6be0",
          500: "#9747d9", // Main purple for agent
          600: "#7939ad",
          700: "#5b2b82",
          800: "#3c1d56",
          900: "#1e0e2b", // Chip background for agent
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
          400: "#f2f0f0", // manually changed
          500: "#ed1c24", // Main brand red from login page
          600: "#d01920", // Darker red (hover state)
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
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#ed1c24", // Match with primary.500
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        purpleAccent: { // Added for Light Mode consistency
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
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[400], // Main app background
              paper: colors.primary[700], // Background for elements like Dialogs, Cards if different
            },
            text: {
              primary: colors.grey[100],
              secondary: colors.grey[300],
            }
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: { // Add this section for global component overrides
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

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};