import "./App.css";
import Header from "./components/Header";
import UploadArea from "./components/UploadArea";

function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <UploadArea />
      </main>
    </div>
  );
}

export default App;