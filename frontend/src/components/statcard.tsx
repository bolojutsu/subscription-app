type StatCardProps = {
    label: string;
    value: string | number;
  };
  
  const StatCard = ({ label, value }: StatCardProps) => (
    <div className="stat-card">
      <h3>{label}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
  
  export default StatCard;