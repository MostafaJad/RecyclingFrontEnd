import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth-context";
import "./RewardsPage.css";
import Header from "../components/Header";
import Confetti from "react-confetti";

function RewardsPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const auth = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redemptionStatus, setRedemptionStatus] = useState({
    loading: false,
    rewardId: null,
    successMessage: null,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      try {
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

  const handleRedeem = async (reward) => {
    setRedemptionStatus({
      loading: true,
      rewardId: reward.id,
      successMessage: null,
    });
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/rewards/${reward.id}/redeem`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      const updateUser = await response.json();

      if (!response.ok) {
        throw new Error(updateUser.detail || "Redemption Failed");
      }
      auth.updateUser(updateUser);
      setRedemptionStatus({
        loading: false,
        rewardId: reward.id,
        successMessage: `🎉 Congratulations! You redeemed "${reward.name}"!`,
      });

      setTimeout(
        () =>
          setRedemptionStatus({
            loading: false,
            rewardId: null,
            successMessage: null,
          }),
        5000
      );
    } catch (error) {
      setError(`Redemption Error: ${error.message}`); // ...the variable name used here.
      setRedemptionStatus({
        loading: false,
        rewardId: null,
        successMessage: null,
      });
    }
  };

  return (
    <>
      <Header /> {/* Assuming Header component is imported */}
      <div className="rewards-container">
        <h2>🏆 Rewards Catalog</h2>
        {/* Display general errors or success messages */}
        {error && <p className="error-text">{error}</p>}
        {redemptionStatus.successMessage && (
          <>
            <p className="success-text">{redemptionStatus.successMessage}</p>
            <Confetti recycle={false} numberOfPieces={2000} />{" "}
          </>
        )}

        <div className="rewards-list">
          {isLoading && <p>Loading rewards...</p>}
          {rewards.map((reward) => {
            // Check if user has enough points
            const canRedeem = auth.user.points >= reward.points_cost;
            const isRedeemingThis =
              redemptionStatus.loading &&
              redemptionStatus.rewardId === reward.id;

            return (
              <div
                key={reward.id}
                className={`reward-card ${!canRedeem ? "disabled" : ""}`}
              >
                <h3>{reward.name}</h3>
                <p>{reward.description}</p>
                <div className="reward-cost">{reward.points_cost} Points</div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem || redemptionStatus.loading} // Disable if not enough points or if any redemption is loading
                  className="redeem-button"
                >
                  {isRedeemingThis ? "Redeeming..." : "Redeem"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default RewardsPage;
