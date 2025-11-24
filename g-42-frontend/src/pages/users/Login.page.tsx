import {
  Button,
  ButtonGroup,
  Flex,
  Form,
  TextField,
  View,
} from "@adobe/react-spectrum";
import { useCallback, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { Navigate } from "react-router";

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
    <Flex direction="column" alignContent="center" alignItems="center">
      <View flexBasis="100%">
        <h3 id="label-3">Login</h3>
        <Form
          onSubmit={onSubmit}
          isRequired
          necessityIndicator="label"
          validationErrors={errors}
          minWidth="size-3600"
        >
          <TextField name="username" label="Username" isRequired />
          <TextField
            name="password"
            label="Password"
            type="password"
            isRequired
          />
          <ButtonGroup marginBottom="size-400" marginTop="size-200">
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </ButtonGroup>
        </Form>
      </View>
      {isAuthenticated && <Navigate to="/" />}
    </Flex>
  );
}
