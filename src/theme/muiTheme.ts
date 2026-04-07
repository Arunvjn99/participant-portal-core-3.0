import { createTheme } from "@mui/material/styles";

/**
 * MUI theme that delegates all colour and typography decisions to the
 * app's CSS-variable system.  Every value uses var(--…) so it
 * automatically respects light/dark mode and per-company branding
 * applied by ThemeContext.
 */
const muiTheme = createTheme({
  cssVariables: false,
  palette: {
    primary: {
      main: "var(--color-primary)",
      dark: "var(--color-primary-active)",
      // MUI needs a static contrastText; white works for all brand primaries
      contrastText: "#ffffff",
    },
    background: {
      default: "var(--color-background)",
      paper: "var(--color-surface)",
    },
    text: {
      primary: "var(--color-text)",
      secondary: "var(--color-text-secondary)",
      disabled: "var(--color-text-tertiary)",
    },
    divider: "var(--color-border)",
    error: {
      main: "var(--color-danger)",
    },
    success: {
      main: "var(--color-success)",
    },
    warning: {
      main: "var(--color-warning)",
    },
  },
  typography: {
    fontFamily: "var(--font-family, system-ui)",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          borderColor: "var(--color-border)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "var(--color-text)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--color-border)",
        },
      },
    },
  },
});

export default muiTheme;
