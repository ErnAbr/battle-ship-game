import { routes } from "../../navigation/routes/routes.js";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import styles from "./topAppBar.module.scss";
import { useAppStore } from "../../context/store.js";
import { Pill } from "../Pill/Pill.jsx";

export const TopAppBar = () => {
  const user = useAppStore((state) => state.user);
  const logoutUser = useAppStore((state) => state.logoutUser);

  const navLinks = user
    ? [
        { name: "Home", path: routes.HOME },
        { name: "Stats", path: routes.STATS },
        { name: "Logout", path: routes.LOGIN, onClick: logoutUser },
      ]
    : [
        { name: "Home", path: routes.HOME },
        { name: "Login", path: routes.LOGIN },
      ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} color="warning" position="static">
        <Toolbar className={styles.toolBarPadding}>
          <div>
            {user ? (
              <Pill text={user.substring(0, 1).toUpperCase()} />
            ) : (
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                Classic BattleShip Game
              </Typography>
            )}
          </div>

          <div>
            {navLinks.map((link, index) => (
              <Button
                component={Link}
                to={link.path}
                key={index}
                color="inherit"
                className={styles.linkButton}
                onClick={link.onClick ? link.onClick : null}
              >
                {link.name}
              </Button>
            ))}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
