import { routes } from "../../navigation/routes/routes.js";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import styles from "./topAppBar.module.scss";

const user = false;

const navLinks = user
  ? [
      { name: "Home", path: routes.HOME },
      { name: "Stats", path: routes.STATS },
    ]
  : [
      { name: "Home", path: routes.HOME },
      { name: "Login", path: routes.LOGIN },
    ];

export const TopAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} color="warning" position="static">
        <Toolbar className={styles.toolBarPadding}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Classic BattleShip Game
          </Typography>
          {navLinks.map((link, index) => (
            <Button
              component={Link}
              to={link.path}
              key={index}
              color="inherit"
              className={styles.linkButton}
            >
              {link.name}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
