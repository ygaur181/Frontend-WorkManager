import React, { useEffect, useState } from "react";
import "../components/workOverview.css";
import { useNavigate } from "react-router-dom";

export default function WorkOverview() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const columns = ["L2C 2.0", "L2C 1.5", "BRS", "Urgent"];

  // Fetch works from backend
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch(
          "https://backend-workmanage.onrender.com/api/works/filter?status=Open&status=Testing&status=Hold"
        );
        const works = await res.json();
        setData(works);
      } catch (err) {
        console.error("Error fetching works:", err);
        alert("Failed to fetch work items. Is backend running?");
      }
    };
    fetchWorks();
  }, []);

  // Determine card color based on status
  const getCardColor = (status) => {
    switch (status) {
      case "Open":
        return "#d4edda"; // green
      case "Hold":
        return "#fff3cd"; // yellow
      case "Close":
        return "#f8d7da"; // red
      case "Testing":
        return "#d1ecf1"; // blue
      default:
        return "#f0f0f0"; // gray
    }
  };

  return (
    <div>
      <div className="workmanager-header">
        <h1 className="workmanager-title">Work Manager</h1>
        <div>
          <button
            className="secondary-btn"
            style={{ marginRight: "10px" }}
            onClick={() => navigate("/detail")}
          >
            New
          </button>
        </div>
      </div>

      <div className="kanban-container">
        {columns.map((col) => {
          const columnCards = data
            .filter((w) => w.category === col)
            .sort((a, b) => a.priority - b.priority);

          return (
            <div key={col} className="kanban-column">
              <h2 className="kanban-title">{col}</h2>
              <div className="kanban-cards">
                {columnCards.length === 0 ? (
                  <div className="no-cards">No work items</div>
                ) : (
                  columnCards.map((work) => (
                    <div
                      key={work._id}
                      className="card"
                      style={{ backgroundColor: getCardColor(work.status), cursor: "pointer" }}
                      onClick={() => navigate(`/detail/${work._id}`)} // navigate to Work Detail page
                    >
                      <strong>{work.title}</strong>
                      <br />
                      <small>Open: {work.openDate || "—"}</small>
                      <br />
                      <small>Finish: {work.expectedFinish || "—"}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
