import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";
import { Button, Tooltip } from "@mui/material";
import { useAppStore } from "../../context/store.js";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { playHitSound, playMissSound } from "../../utils/sounds.js";
import { LoadingComponent } from "../../components/LoadingComponent/LoadingComponent.jsx";
import { PillComponent } from "../../components/PillComponent/PillComponent.jsx";

export const Homepage = () => {
  const initialAvailableShips = useMemo(
    () => [
      { size: 2, id: 1 },
      // { size: 3, id: 2 },
      // { size: 3, id: 3 },
      // { size: 4, id: 4 },
      // { size: 5, id: 5 },
    ],
    []
  );

  const [ships, setShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(initialAvailableShips);
  const [enemyShips, setEnemyShips] = useState([]);
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);
  const [enemyHits, setEnemyHits] = useState([]);
  const [enemyMisses, setEnemyMisses] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const user = useAppStore((state) => state.user);

  const resetBoard = useCallback(() => {
    setShips([]);
    setAvailableShips(initialAvailableShips);
    setHits([]);
    setEnemyHits([]);
    setEnemyMisses([]);
    setMisses([]);
    setEnemyShips([]);
    setIsGameStarted(false);
  }, [initialAvailableShips]);

  //websocket logic
  const socketRef = useRef(null);
  const shipsRef = useRef([]);

  useEffect(() => {
    shipsRef.current = ships;
  }, [ships]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
      });
    }

    socketRef.current.on("start-game", (enemyShipsData) => {
      setEnemyShips(enemyShipsData);
      setIsGameStarted(true);
      setIsWaiting(false);
    });

    socketRef.current.on("game-over", (result) => {
      if (result === "win") {
        toast.success("Game Over! You win!");
      } else if (result === "lose") {
        toast.error("Game Over! You lose!");
      }
      resetBoard();
    });

    socketRef.current.on("your-turn", () => {
      toast.success("It's your turn!");
      setIsMyTurn(true);
    });

    socketRef.current.on("enemy-shot", (coordinate) => {
      if (shipsRef.current.includes(coordinate)) {
        setEnemyHits((prevHits) => [...prevHits, coordinate]);
        playHitSound();
      } else {
        setEnemyMisses((prevMisses) => [...prevMisses, coordinate]);
        playMissSound();
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [resetBoard]);

  const startGame = () => {
    if (availableShips.length === 0) {
      console.log("Sending ship data to server...");
      socket.emit("join-game", user, ships);
      setIsWaiting(true);
    }
  };

  //websocket logic end

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  const socket = socketRef.current;

  const handleEnemyBoardClick = (coordinate) => {
    if (!isMyTurn) {
      toast.warning("It's not your turn!");
      return;
    }
    if (enemyShips.includes(coordinate)) {
      setHits((prevHits) => [...prevHits, coordinate]);
      playHitSound();
    } else {
      setMisses((prevMisses) => [...prevMisses, coordinate]);
      playMissSound();
    }

    socket.emit("hit", user, coordinate);
    setIsMyTurn(false);
  };

  if (!isGameStarted && isWaiting) {
    return <LoadingComponent text="Waiting for opponent to join..." />;
  }

  return (
    <SplitScreen>
      <div>
        <GameBoard
          setShips={setShips}
          ships={ships}
          onShipPlaced={handleShipPlacement}
          hits={enemyHits}
          misses={enemyMisses}
        />

        <div className={styles.shipSelectionBoard}>
          <div className={styles.titleContainer}>
            <h3>Place Your Ships:</h3>
            <Tooltip
              title="Change horizontal to vertical positions of a 
              ship by right clicking and drag your ships to the board! To change ship placement
              just press Reset"
              arrow
              placement="right-end"
            >
              <div>
                <PillComponent text="i" size="small" />
              </div>
            </Tooltip>
          </div>
          {availableShips.map((ship) => (
            <Ship key={ship.id} size={ship.size} id={ship.id} />
          ))}
          <Button
            onClick={startGame}
            color="success"
            variant="contained"
            disabled={availableShips.length > 0 || !user || isGameStarted}
          >
            Ready
          </Button>
          <Button
            onClick={resetBoard}
            color="warning"
            variant="contained"
            disabled={isGameStarted}
          >
            Reset
          </Button>
        </div>
      </div>

      <GameBoard
        isEnemyBoard={true}
        onCellClick={handleEnemyBoardClick}
        hits={hits}
        misses={misses}
      />
    </SplitScreen>
  );
};
