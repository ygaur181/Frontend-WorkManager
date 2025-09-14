import React from "react";
import "./workAll.css";

export default function WorkAll({ workList }) {
  return (
    <div className="work-all-container">
      <h2>All Work Items</h2>
      <table className="work-all-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Expected Finish</th>
          </tr>
        </thead>
        <tbody>
          {workList && workList.length > 0 ? (
            workList.map((work) => (
              <tr key={work.id}>
                <td>{work.title}</td>
                <td>{work.category}</td>
                <td>{work.expectedFinish}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="work-all-empty">No work items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
