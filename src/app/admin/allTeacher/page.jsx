"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; 

import "./allTeacher.css";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query

  // Fetch teacher data from the API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch teachers.");
        }

        const data = await response.json();
        setTeachers(data.Data); // Assuming the response has a 'teachers' field
        setFilteredTeachers(data.Data); // Initially show all teachers
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("An error occurred while fetching the teachers' data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Function to highlight matching text
  const highlightText = (text, query) => {
    if (!query) return text; // Return the original text if no search query

    const regex = new RegExp(`(${query})`, "gi"); // Create a case-insensitive regex to match the query
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        part
      )
    );
  };

  // Filter teachers based on search query, excluding 'role' field
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter teachers by name, email, department, and mobile, excluding role
    const filtered = teachers.filter((teacher) =>
      Object.entries(teacher)
        .filter(([key]) => ['email', 'name', 'department', 'mobile'].includes(key)) // Only include specific fields
        .some(([_, value]) =>
          value ? value.toString().toLowerCase().includes(query) : false
        )
    );
    setFilteredTeachers(filtered);
  };

  if (loading) {
    return <p>Loading teachers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="teachers-list">
      <h1>Teachers</h1>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by any field..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {filteredTeachers.length > 0 ? (
        <table className="teachers-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Mobile</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>
                  {teacher.profileImage ? (
                    <Image
                      src={`data:image/jpeg;base64,${Buffer.from(teacher.profileImage).toString("base64")}`}
                      alt={`${teacher.name}'s profile`}
                      width={50} // Image width
                      height={50} // Image height
                      className="teacher-profile-img"
                    />
                  ) : (
                    <div className="teacher-profile-placeholder">No Image</div>
                  )}
                </td>
                <td>{highlightText(teacher.name, searchQuery)}</td>
                <td>{highlightText(teacher.email, searchQuery)}</td>
                <td>{highlightText(teacher.department, searchQuery)}</td>
                <td>{highlightText(teacher.mobile, searchQuery)}</td>
                <td>{highlightText(teacher.role || "Not assigned", searchQuery)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No teachers found.</p>
      )}
    </div>
  );
};

export default TeachersList;
