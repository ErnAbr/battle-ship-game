import { Container, Box, Button } from "@mui/material";
import styles from "./loginpage.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal } from "../../components/Modal/Modal.jsx";
import { RegisterForm } from "./RegisterForm.jsx";
import { api } from "../../api/api.js";
import { toast } from "react-toastify";
import { useAppStore } from "../../context/store.js";
import { useNavigate } from "react-router-dom";
import { routes } from "../../navigation/routes/routes.js";

export const Loginpage = () => {
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    try {
      navigate(routes.HOME);
      const response = await api.Users.loginUser(data);
      setUser(response.user.username);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

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
          <h4 className={styles.registerLink}>
            Do not have an account?{" "}
            <span>
              <Modal buttonName="Register Here!">
                <RegisterForm />
              </Modal>
            </span>
          </h4>
        </Box>
      </Container>
    </>
  );
};
