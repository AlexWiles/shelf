import React from "react";
import { useSelector } from "react-redux";
import { AppState, ViewingPage } from "./types";
import { Layout } from "antd";
import { Sidebar } from "./components/Sidebar";
import { AppProvider, BookScreen } from "./components/Screen";

import "./App.css";
import "antd/dist/antd.css";

const Screen: React.FC = () => {
  const [viewing] = useSelector<AppState, [ViewingPage, string | undefined]>(
    ({ currentBookId, viewing }) => [viewing, currentBookId]
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      {viewing === "books" ? <BookScreen /> : <Layout></Layout>}
    </Layout>
  );
};

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Screen />
      </AppProvider>
    </div>
  );
}

export default App;
