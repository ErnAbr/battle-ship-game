import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import styles from "./loginpage.module.scss";
import { Box, Button } from "@mui/material";

export const RegisterForm = () => {
  const schema = yup
    .object({
      username: yup.string().required("User Name is required"),
      email: yup
        .string()
        .email("Invalid email format")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email")
        .required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
      repPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldFocusError: false,
  });

  const onSubmit = (data) => console.log(data);

  return (
    <>
      <Box className={styles.registerBoxStyle}>
        <h2>Please Register</h2>
        <form className={styles.formStyles} onSubmit={handleSubmit(onSubmit)}>
          <label>Enter Your Username</label>
          <input {...register("username")} />
          {errors.username && (
            <p className={styles.errorMessage}>{errors.username.message}</p>
          )}
          <label>Enter Your Email</label>
          <input {...register("email")} />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          )}
          <label>Enter Your Password</label>
          <input type="password" {...register("password")} />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
          <label>Repeat Your Password</label>
          <input type="password" {...register("repPassword")} />
          {errors.repPassword && (
            <p className={styles.errorMessage}>{errors.repPassword.message}</p>
          )}
          <Button
            className={styles.registerButton}
            type="submit"
            color="warning"
            variant="contained"
          >
            Register
          </Button>
        </form>
      </Box>
    </>
  );
};
