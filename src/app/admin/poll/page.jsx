"use client";
import React, { useState, useEffect } from "react";
import "./poll.css";

const CreatePoll = () => {
  const [title, setTitle] = useState(""); // Poll title
  const [description, setDescription] = useState(""); // Poll description
  const [lastDate, setLastDate] = useState(""); // Poll deadline
  const [status, setStatus] = useState("open"); // Poll status
  const [polls, setPolls] = useState([]); // State to store all polls
  const [selectedPoll, setSelectedPoll] = useState(null); // State for selected poll details

  // Fetch all polls from the API
  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/poll");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPolls(data.polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  useEffect(() => {
    fetchPolls(); // Fetch polls on component mount
  }, []);

  // Handle form submission for creating a new poll
  const handleSubmit = async (e) => {
    e.preventDefault();

    const pollData = {
      title,
      description,
      lastDate,
      status,
    };

    try {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Poll created successfully:", data);
      fetchPolls(); // Refresh the list of polls after creation
      setTitle("");
      setDescription("");
      setLastDate("");
      setStatus("open");
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  // Handle view details button click
  const handleViewDetails = (poll) => {
    setSelectedPoll(poll); // Set the selected poll to display its details
  };

  return (
    <div className="admin-poll-container">
      <h1 className="admin-poll-title">Create a New Poll</h1>
      <form className="admin-poll-form" onSubmit={handleSubmit}>
        {/* Poll Title */}
        <div className="admin-poll-field">
          <label htmlFor="title" className="admin-poll-label">
            Poll Title:
          </label>
          <input
            type="text"
            id="title"
            className="admin-poll-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the poll title"
            required
          />
        </div>

        {/* Poll Description */}
        <div className="admin-poll-field">
          <label htmlFor="description" className="admin-poll-label">
            Poll Description:
          </label>
          <textarea
            id="description"
            className="admin-poll-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter the poll description"
            required
          />
        </div>

        {/* Poll Last Date */}
        <div className="admin-poll-field">
          <label htmlFor="lastDate" className="admin-poll-label">
            Poll Deadline:
          </label>
          <input
            type="date"
            id="lastDate"
            className="admin-poll-input"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            required
          />
        </div>

        {/* Poll Status */}
        <div className="admin-poll-field">
          <label htmlFor="status" className="admin-poll-label">
            Poll Status:
          </label>
          <select
            id="status"
            className="admin-poll-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="admin-poll-submit">
          Create Poll
        </button>
      </form>

      {/* Display All Polls */}
      <div className="admin-poll-list">
        <h2 className="admin-poll-subtitle">All Polls</h2>
        {polls.length > 0 ? (
          <ul className="admin-poll-items">
            {polls.map((poll) => (
              <li key={poll._id} className="admin-poll-item">
                <h3 className="admin-poll-item-title">{poll.title}</h3>
                <p className="admin-poll-item-description">
                  {poll.description}
                </p>
                <p className="admin-poll-item-date">
                  Deadline: {new Date(poll.lastDate).toLocaleDateString()}
                </p>
                <p className={`admin-poll-item-status ${poll.status}`}>
                  Status: {poll.status}
                </p>

                {/* View Details Button */}
                <button
                  className="admin-poll-view-details"
                  onClick={() => handleViewDetails(poll)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-poll-empty">No polls available.</p>
        )}
      </div>

      {/* Display Poll Details */}
      {selectedPoll && (
        <div className="admin-poll-details">
          <h2 className="admin-poll-details-title">Poll Details</h2>
          <h3>{selectedPoll.title}</h3>
          <p>{selectedPoll.description}</p>
          <p>Deadline: {new Date(selectedPoll.lastDate).toLocaleDateString()}</p>
          <p>Status: {selectedPoll.status}</p>

          <h4>Votes</h4>
          <p>
            <strong>Yes Votes:</strong> {selectedPoll.yesVote ? selectedPoll.yesVote.length : 0}
          </p>
          <ul>
            {selectedPoll.yesVote && selectedPoll.yesVote.map((vote, index) => (
              <li key={index}>{vote}</li>
            ))}
          </ul>

          <p>
            <strong>No Votes:</strong> {selectedPoll.noVote ? selectedPoll.noVote.length : 0}
          </p>
          <ul>
            {selectedPoll.noVote && selectedPoll.noVote.map((vote, index) => (
              <li key={index}>{vote}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
