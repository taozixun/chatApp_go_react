import './css/App.css';
import IndexRouter from './router/indexRouter';
function App() {
  return (
    <>
      <h1 style={{
        position:"absolute",
        left:"50%",
        transform: "translate(-50%,0)",
        top:"20px",
        color:"#1677FF",
      }}>TT聊天室</h1>
      <IndexRouter/>
    </>
  );
}

export default App;
