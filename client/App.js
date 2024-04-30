// App.js
import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./configs/apollo";
import { LoginProvider } from "./contexts/LoginContext";
import StackHolder from "./stacks/StackHolder";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <StackHolder />
      </LoginProvider>
    </ApolloProvider>
  );
}
