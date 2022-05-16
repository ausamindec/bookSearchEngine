import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutation";

const LoginForm = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [isValidated] = useState(false);
  const [showAlerts, setshowAlerts] = useState(false);

  const [login] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: userData,
      });

      const { token } = await data.login;
      Auth.login(token);
    } catch (err) {
      console.log(`Error: ${err}`);
      setshowAlerts(true);
    }

    setUserData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate isValidated={isValidated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setshowAlerts(false)}
          show={showAlerts}
          variant="danger"
        >
          Please Check your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userData.email && userData.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;