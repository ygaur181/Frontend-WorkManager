import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaSave } from "react-icons/fa"; // Using react-icons for consistent icons
import "./workDetail.css";

export default function WorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const defaultFields = [
    { label: "Open Date", name: "openDate", value: "", type: "date" },
    { label: "Close Date", name: "closeDate", value: "", type: "date" },
    { label: "Expected Finish", name: "expectedFinish", value: "", type: "date" },
    { label: "Priority", name: "priority", value: "", type: "number" },
    { label: "Tester", name: "tester", value: "", type: "text" }
  ];

  const [editMode, setEditMode] = useState(!id);
  const [work, setWork] = useState({ category: "", title: "", status: "", fields: defaultFields });
  const [fields, setFields] = useState(defaultFields);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Load work details
  useEffect(() => {
    if (id) {
      fetch(`https://backend-workmanage.onrender.com/api/works/${id}`)
        .then(res => res.json())
        .then(data => {
          setWork({
            category: data.category || "",
            title: data.title || "",
            status: data.status || ""
          });
          setFields([
            { label: "Open Date", name: "openDate", value: data.openDate || "", type: "date" },
            { label: "Close Date", name: "closeDate", value: data.closeDate || "", type: "date" },
            { label: "Expected Finish", name: "expectedFinish", value: data.expectedFinish || "", type: "date" },
            { label: "Priority", name: "priority", value: data.priority || "", type: "number" },
            { label: "Tester", name: "tester", value: data.tester || "", type: "text" }
          ]);
          setEditMode(false);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // Fetch comments from API
  const fetchComments = async () => {
    if (!id) return;
    try {
      const res = await fetch(`https://backend-workmanage.onrender.com/api/comments/${id}`);
      const data = await res.json();
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const handleEditSave = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    const payload = {
      title: work.title,
      status: work.status,
      category: work.category,
      openDate: fields.find(f => f.name === "openDate")?.value || "",
      closeDate: fields.find(f => f.name === "closeDate")?.value || "",
      expectedFinish: fields.find(f => f.name === "expectedFinish")?.value || "",
      priority: Number(fields.find(f => f.name === "priority")?.value || 0),
      tester: fields.find(f => f.name === "tester")?.value || ""
    };

    try {
      if (id) {
        await fetch(`https://backend-workmanage.onrender.com/api/works/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        alert("Work updated successfully!");
      } else {
        const res = await fetch("https://backend-workmanage.onrender.com/api/works/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert("Work created successfully!");
        navigate(`/detail/${data._id}`);
      }
      setWork({ ...work, ...payload });
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Error saving work");
    }
  };

  const handleFieldChange = (idx, value) => {
    const updatedFields = [...fields];
    updatedFields[idx].value = value;
    setFields(updatedFields);
  };

  const handleWorkChange = (field, value) => {
    setWork({ ...work, [field]: value });
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await fetch(`https://backend-workmanage.onrender.com/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId: id, text: comment.trim() })
      });
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment.");
    }
  };

  const handleEditComment = (c) => {
    setEditingCommentId(c._id);
    setEditingCommentText(c.text);
  };

  const handleSaveComment = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      await fetch(`https://backend-workmanage.onrender.com/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingCommentText })
      });
      setEditingCommentId(null);
      setEditingCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment.");
    }
  };

  return (
    <div className="work-detail-layout">
      <div className="work-detail-header">
        <h2 className="workmanager-title">{id ? "Work Detail" : "New Work"}</h2>

        <div>
          <button
            className="secondary-btn"
            style={{ marginRight: "10px" }}
            onClick={() => navigate("/")}
          >
            Back to Overview
          </button>

          <button className="work-detail-edit-btn" onClick={handleEditSave}>
            {editMode ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div className="work-detail-flex">
        {/* Left Panel */}
        <div className="work-detail-main">
          <div className="work-detail-main-upper">
            <span className="work-detail-span">
              {editMode ? (
                <select
                  value={work.category}
                  onChange={(e) => handleWorkChange("category", e.target.value)}
                  className="work-detail-input"
                >
                  <option value="">Select Category</option>
                  <option value="L2C 2.0">L2C 2.0</option>
                  <option value="L2C 1.5">L2C 1.5</option>
                  <option value="BRS">BRS</option>
                  <option value="Urgent">Urgent</option>
                </select>
              ) : (
                work.category || "—"
              )}
            </span>

            <span className="work-detail-span">
              {editMode ? (
                <input
                  type="text"
                  value={work.title}
                  onChange={(e) => handleWorkChange("title", e.target.value)}
                  className="work-detail-input"
                />
              ) : (
                work.title || "—"
              )}
            </span>

            <span className="work-detail-span" >
              {editMode ? (
                <select
                  value={work.status}
                  onChange={(e) => handleWorkChange("status", e.target.value)}
                  className="work-detail-input"
                >
                  <option value="">Select Status</option>
                  <option value="Open">Open</option>
                  <option value="Hold">Hold</option>
                  <option value="Close">Close</option>
                  <option value="Testing">Testing</option>
                </select>
              ) : (
                work.status || "—"
              )}
            </span>
          </div>

          {/* Comments */}
          <div className="work-detail-main-lower">
            <textarea
              className="work-detail-comment-area"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="work-detail-comment-btn" onClick={handleAddComment}>
              Add Comment
            </button>

            <div className="work-detail-comments-list">
              {comments.length === 0 ? (
                <div className="work-detail-no-comments">No comments yet.</div>
              ) : (
                comments.map((c) => (
                  <div className="work-detail-comment-item" key={c._id}>
                    {editingCommentId === c._id ? (
                      <>
                        <input
                          type="text"
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="work-detail-input"
                        />
                        <FaSave
                          className="comment-icon save-icon"
                          onClick={() => handleSaveComment(c._id)}
                        />
                      </>
                    ) : (
                      <>
                        <span>{c.text}</span>
                        <FaEdit
                          className="comment-icon edit-icon"
                          onClick={() => handleEditComment(c)}
                        />
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="work-detail-right">
          {fields.map((field, idx) => (
            <div className="work-detail-right-item" key={field.name}>
              <label className="work-detail-label">{field.label}</label>
              {editMode ? (
                <input
                  className="work-detail-input"
                  type={field.type || "text"}
                  value={field.value}
                  onChange={(e) => handleFieldChange(idx, e.target.value)}
                />
              ) : (
                <div className="work-detail-info">
                  {field.value || <span style={{ color: "#bbb" }}>—</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
