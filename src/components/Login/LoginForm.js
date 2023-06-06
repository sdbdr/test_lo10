import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { login } from "../../api/travelAdvisorAPI";
import { Context, ContextProvider } from "../Router/Trip/context";

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

function LoginForm({ onLogin }) {
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
      document.cookie = `sessionId=${data.session.sessionId}; path=/;`;
      onLogin(data.session);
      setUserId(data.userId);
      localStorage.setItem("userId", JSON.stringify(data.userId));
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
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
}

export default LoginForm;
