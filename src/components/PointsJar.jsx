// src/PointsJar.jsx
import "./PointsJar.css";

const PointsJar = ({ points }) => {
  const MAX_POINTS_PER_JAR = 100;
  // Calculate how full the current jar is (0-100)
  const fillPercentage =
    ((points % MAX_POINTS_PER_JAR) / MAX_POINTS_PER_JAR) * 100;

  return (
    <div className="jar-widget">
      <div className="jar-container">
        {/* The fill is now a container for the wave */}
        <div className="jar-fill" style={{ height: `${fillPercentage}%` }}>
          <div className="wave wave-back"></div>
          <div className="wave wave-front"></div>
        </div>
      </div>
      <div className="points-display">{points} Points</div>
    </div>
  );
};

export default PointsJar;
