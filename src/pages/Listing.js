import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

const Listing = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLinks = async (page = 1) => {
    try {
      const response = await axios.post("http://localhost:5000/links", {
        page,
        limit: 10,
      });
      setLinks(response.data.links);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch links:", err);
    }
  };
  

  useEffect(() => {
    fetchLinks();
  }, []);

  const handlePageChange = (page) => {
    fetchLinks(page);
  };

  return (
    <div class="wrapper">
      <div className="container">
        <h1 className="title">All Shortened Links</h1>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Original URL</th>
              <th>Shortened URL</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => (
              <tr key={link.shortUrl}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td className="original-url">{link.originalUrl}</td>
                <td>
                  <a href={`http://localhost:5000/${link.shortUrl}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:5000/${link.shortUrl}`}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listing;
