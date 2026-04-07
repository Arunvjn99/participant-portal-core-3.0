import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import muiTheme from "../theme/muiTheme";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <AppRoutes />
    </MuiThemeProvider>
  );
};
