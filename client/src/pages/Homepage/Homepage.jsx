import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";

export const Homepage = () => {
  return (
    <SplitScreen>
      <GameBoard />
      <GameBoard />
    </SplitScreen>
  );
};
