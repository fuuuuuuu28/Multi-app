import Authentication from "./auth/Authentication";
import ChatPage from "./pages/ChatPage";
import { Route, Routes } from "react-router";
import TodoPage from "./pages/TodoPage";
import ChatBot from "./pages/Chatbot"
import Layout from "./layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/authentication" element={<Authentication />} />

        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<ChatPage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/chatbot" element={<ChatBot />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
