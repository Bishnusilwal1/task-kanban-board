import React from "react";
import Board from "./(components)/Board";

const App: React.FC = () => {
  return (
    <div className=" bg-gradient-to-r from-[#20282a] to-[#4C585B] min-h-screen">
      <div className="m-4 h-screen">
        <Board />
      </div>
    </div>
  );
};

export default App;
