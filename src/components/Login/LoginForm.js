import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { login } from "../../api/travelAdvisorAPI";
import { Context } from "../Router/Trip/context";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  formField: {
    margin: theme.spacing(2),
  },
}));

const LoginForm = ({ onLogin }) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { userId, setUserId } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(username, password);
    const data = await response.json();

    if (data.success) {
      setUserId(data.user.id);
      document.cookie = `sessionId=${data.session.sessionId}; path=/;`;
      onLogin(data.session);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.id);
    }
  }, [setUserId]);

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <h3>Please login!</h3>
      {error && <div>{error}</div>}
      <TextField
        className={classes.formField}
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        className={classes.formField}
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className={classes.formField}
        variant="contained"
        color="primary"
        type="submit"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
