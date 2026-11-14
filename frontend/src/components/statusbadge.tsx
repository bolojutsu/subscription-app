const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={`badge ${active ? "badge--active" : "badge--canceled"}`}>
      {active ? "Active" : "Canceled"}
    </span>
  );
  
  export default StatusBadge;