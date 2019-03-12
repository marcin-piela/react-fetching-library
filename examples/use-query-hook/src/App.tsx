import React from "react";
import { ClientContextProvider } from "react-fetching-library";
import { UsersListContainer } from "./usersList/UsersListContainer";
import { Client } from "./api/Client";

const App = () => {
  return (
    <ClientContextProvider client={Client}>
      <UsersListContainer />
    </ClientContextProvider>
  );
};

export default App;
