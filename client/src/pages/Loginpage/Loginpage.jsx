import { Container, Box, Button } from "@mui/material";
import styles from "./loginpage.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const Loginpage = () => {
  const schema = yup
    .object({
      username: yup.string().required("Your Username is Required"),
      password: yup.string().required("Your Password is Required"),
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
      <Container maxWidth="md">
        <Box className={styles.loginBoxStyle}>
          <h2>Please Log In</h2>
          <form className={styles.formStyles} onSubmit={handleSubmit(onSubmit)}>
            <label>Enter Your Username</label>
            <input {...register("username")} />
            {errors.username && (
              <p className={styles.errorMessage}>{errors.username.message}</p>
            )}
            <label>Enter Your Password</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password.message}</p>
            )}
            <Button type="submit" color="warning" variant="contained">
              Log In
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};
