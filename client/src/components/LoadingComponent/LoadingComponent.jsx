import { CircularProgress } from "@mui/material";

export const LoadingComponent = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "50px",
      }}
    >
      <CircularProgress color="primary" />
      <p>{text}</p>
    </div>
  );
};
