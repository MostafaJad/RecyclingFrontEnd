import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth-context";
import "./RewardsPage.css";
import Header from "../components/Header";

function RewardsPage() {
  const auth = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/rewards`);
        if (!response.ok) {
          throw new Error("Could not fetch rewards");
        }
        const data = await response.json();
        setRewards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRewards();
  }, []);

  return (
    <>
      <Header />
      <div className="rewards-container">
        <header className="page-header">
          <h2>Rewards Catalog</h2>
          <button onClick={auth.logout}>Logout</button>
        </header>
        <div className="rewards-list">
          {isLoading && <p>Loading rewards...</p>}
          {error && <p className="error-text">{error}</p>}
          {rewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <h3>{reward.name}</h3>
              <p>{reward.description}</p>
              <div className="reward-cost">{reward.points_cost} Points</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default RewardsPage;
