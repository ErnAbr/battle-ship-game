import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import { routes } from "../../navigation/routes/routes.js";

const messages = {
  success: {
    text: "Email Verified Successfully!",
    color: "success",
    buttonText: "Go to Login",
    buttonRoute: routes.LOGIN,
  },
  failed: {
    text: "Verification Failed! Token may be expired or invalid.",
    color: "error",
    buttonText: "Go to Home",
    buttonRoute: routes.HOME,
  },
  error: {
    text: "Something went wrong!",
    color: "error",
    buttonText: "Go to Home",
    buttonRoute: routes.HOME,
  },
};

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  const { text, color, buttonText, buttonRoute } = messages[status];

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" color={color} mb="2vh">
        {text}
      </Typography>
      <Button
        variant="contained"
        color={color}
        onClick={() => navigate(buttonRoute)}
      >
        {buttonText}
      </Button>
    </Container>
  );
};
