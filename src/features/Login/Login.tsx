import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Formik, FormikHelpers, FormikValues } from "formik";
import { useAppDispatch } from "store/store.hooks";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authThunks } from "store/auth-reducer";
import { BaseResponse, LoginData } from "common/api";
import { selectIsLoggedIn } from "features/Login";

type FormikError = Partial<LoginData>;

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const validateHandler = (values: FormikValues) => {
    const errors: FormikError = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length <= 2) {
      errors.password = "Must be 3 characters or more";
    }
    return errors;
  };
  const onSubmitHandler = (values: LoginData, FormikHelpers: FormikHelpers<LoginData>) => {
    const { setFieldError, resetForm } = FormikHelpers;
    dispatch(authThunks.login(values))
      .unwrap()
      .then(() => {
        resetForm();
      })
      .catch((data: BaseResponse) => {
        const { fieldsErrors } = data;
        if (fieldsErrors) {
          fieldsErrors.forEach(({ field, error }) => {
            setFieldError(field, error);
          });
        }
      });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false,
          }}
          validate={validateHandler}
          onSubmit={onSubmitHandler}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, handleBlur, getFieldProps, errors, handleChange, values }) => (
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>
                  <p>
                    To log in get registered
                    <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                      {" "}
                      here
                    </a>
                  </p>
                  <p>or use common test account credentials:</p>
                  <p>Email: free@samuraijs.com</p>
                  <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                  <TextField label="Email" margin="normal" {...getFieldProps("email")} onBlur={handleBlur} />
                  {errors.email ? <div style={{ color: "red" }}>{errors.email}</div> : null}
                  <TextField
                    type="password"
                    label="Password"
                    margin="normal"
                    {...getFieldProps("password")}
                    onBlur={handleBlur}
                  />
                  {errors.password ? <div style={{ color: "red" }}>{errors.password}</div> : null}
                  <FormControlLabel
                    label={"Remember me"}
                    control={<Checkbox name="rememberMe" onChange={handleChange} value={values.rememberMe} />}
                  />
                  <Button type={"submit"} variant={"contained"} color={"primary"}>
                    Login
                  </Button>
                </FormGroup>
              </FormControl>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};
