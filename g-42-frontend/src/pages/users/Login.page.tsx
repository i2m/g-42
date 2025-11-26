import { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { Navigate } from "react-router";

import { useAuthContext } from "./Auth.context";

export function Login() {
  const { login, isAuthenticated } = useAuthContext();

  const [errors, setErrors] = useState<
    | {
        username?: string;
        password?: string;
      }
    | undefined
  >(undefined);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget));
      login({
        username: data["username"] as string,
        password: data["password"] as string,
      })
        .then(() => {
          setErrors(undefined);
        })
        .catch((error) => {
          setErrors({ password: error.message });
        });
    },
    [login],
  );

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <View flex>
        <h3 id="label-3">Login</h3>
      </View>
      <View flex>
        <Form
          onSubmit={onSubmit}
          isRequired
          necessityIndicator="label"
          validationErrors={errors}
        >
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowGap="size-400"
          >
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                name="username"
                label="Username"
                isRequired
                width="size-3000"
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                isRequired
                width="size-3000"
              />
            </Flex>
            <View flex>
              <ButtonGroup>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </ButtonGroup>
            </View>
          </Flex>
        </Form>
      </View>
      {isAuthenticated && <Navigate to="/" />}
    </Flex>
  );
}
