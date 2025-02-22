import { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import { toast } from "react-toastify";
import { LoadingComponent } from "../../components/LoadingComponent/LoadingComponent.jsx";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

export const Statspage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userStats = await api.GameStats.getStats();
        setStats(userStats || []);
      } catch (error) {
        toast.error(error);
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingComponent text="Fetching Stats" />;
  }

  if (!stats) {
    return <div>No stats available.</div>;
  }

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3vh",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={3}
        style={{
          width: "50vw",
          textAlign: "center",
        }}
      >
        <Table>
          <TableBody>
            {Object.entries(stats).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell
                  sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                >
                  {key.split(/(?=[A-Z])/).join(" ")}
                </TableCell>
                <TableCell align="center">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
