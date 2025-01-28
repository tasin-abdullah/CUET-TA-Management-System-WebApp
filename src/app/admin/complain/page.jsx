"use client";

import React, { useEffect, useState } from "react";
import "./complain.css"

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({}); // State to manage reply text for each complaint

  // Fetch all complaints on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("/api/complain");

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched complaints:", data);
          setComplaints(data.complaints);
        } else {
          setError("Failed to fetch complaints.");
        }
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("An error occurred while fetching complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Handle reply text changes
  const handleReplyChange = (complaintId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  };

  // Handle reply submission
  const handleReplySubmit = async (complaintId) => {
    const reply = replyText[complaintId]?.trim();

    if (!reply) {
      alert("Reply cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/api/complain", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: complaintId,
          reply,
        }),
      });

      if (response.ok) {
        alert("Reply submitted successfully!");
        // Update the local state after successfully replying
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint._id === complaintId ? { ...complaint, reply } : complaint
          )
        );
        // Clear the reply input for this complaint
        setReplyText((prev) => ({
          ...prev,
          [complaintId]: "",
        }));
      } else {
        alert("Failed to submit reply.");
      }
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert("An error occurred while submitting the reply.");
    }
  };

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-complaints-page">
      <h1>All Complaints</h1>
      {complaints.length > 0 ? (
        <ul className="complaints-list">
          {complaints.map((complaint) => (
            <li key={complaint._id} className="complaint-item">
              <p>
                <strong>Teacher Name:</strong> {complaint.teacherName}
              </p>
              <p>
                <strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Complaint:</strong> {complaint.complain}
              </p>
              <div className="reply-section">
                <p>
                  <strong>Reply:</strong>{" "}
                  {complaint.reply !== "Waiting For Reply......" ? (
                    <span>{complaint.reply}</span>
                  ) : (
                    <>
                      <textarea
                        placeholder="Write your reply here..."
                        className="reply-input"
                        value={replyText[complaint._id] || ""}
                        onChange={(e) =>
                          handleReplyChange(complaint._id, e.target.value)
                        }
                      />
                      <button onClick={() => handleReplySubmit(complaint._id)}>
                        Submit
                      </button>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
