import { useEffect, useState } from "react";
import { api } from "../../api/api.js";
import { toast } from "react-toastify";
import { LoadingComponent } from "../../components/LoadingComponent/LoadingComponent.jsx";

export const Statspage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userStats = await api.GameStats.getStats();
        setStats(userStats);
      } catch (error) {
        toast.error(error);
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  console.log(stats);

  if (loading) {
    return <LoadingComponent text="Fetching Stats" />;
  }

  return <div>This is Statspage</div>;
};
