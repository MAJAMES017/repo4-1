import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});
  const borderColor = "#ccc";

  const loadAllFiles = async () => {
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent("*")}`
      );
      const data = await response.json();
      setResults(data.files || []);
      setSearchPerformed(false);
      setSearchQuery("");
      setExpandedFiles({});
    } catch (error) {
      console.error("Error loading all files:", error);
    }
  };

  useEffect(() => {
    loadAllFiles();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.files || []);
      setSearchPerformed(true);
      // Reset expanded states
      setExpandedFiles({});
    } catch (error) {
      console.error("Error searching files:", error);
    }
  };

  const toggleFile = (file) => {
    setExpandedFiles((prev) => ({ ...prev, [file.id]: !prev[file.id] }));
  };

  const openFullWindow = (file, e) => {
    e.stopPropagation();
    window.open(
      `https://drive.google.com/file/d/${file.id}/preview`,
      "_blank"
    );
  };

  return (
    <div>
      {/* Search Bar Container */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleSearch} className="mt-3 flex items-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-3/4 max-w-sm p-2 rounded-md text-center focus:outline-none"
            style={{
              backgroundColor: "var(--whitebg-color)",
              border: "1px solid #9ca3af",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 py-2 px-4 rounded-md text-white hover:bg-[var(--secondary-blue)]"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Container for files/folders */}
      <div
        style={{
          marginTop: "20px",
          width: "80vw",
          marginLeft: "10vw",
          marginRight: "10vw",
          border: `2px solid ${borderColor}`,
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "#fff",
          position: "relative",
          boxSizing: "border-box",
          marginBottom: "60px",
        }}
      >
        {/* Results/Files aand X button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `2px solid ${borderColor}`,
            paddingBottom: "10px",
            marginBottom: "10px",
            minHeight: "40px",
          }}
        >
          <h3 style={{ marginLeft: 8, fontSize: "1.5em" }}>
            {searchPerformed ? "Results" : "Files"}
          </h3>
          {searchPerformed && (
            <button
              onClick={loadAllFiles}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.2em",
                cursor: "pointer",
                marginRight: "8px"
              }}
              title="Show all files"
            >
              ✕
            </button>
          )}
        </div>
        {results.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 10, margin: 0 }}>
            {results.map((file, index) => (
              <li
                id={`file-${file.id}`}
                key={file.id}
                style={{
                  padding: "5px 0",
                  borderBottom:
                    index === results.length - 1
                      ? "none"
                      : `1px solid ${borderColor}`,
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* file name */}
                  <span style={{ cursor: "pointer" }} onClick={() => toggleFile(file)}>
                    {file.name}
                  </span>
                  {/* full button and dropdown */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={(e) => openFullWindow(file, e)}
                      style={{
                        marginRight: "8px",
                        padding: "2px 6px",
                        fontSize: "0.8em",
                        cursor: "pointer",
                      }}
                    >
                      Full
                    </button>
                    <div onClick={() => toggleFile(file)} style={{ cursor: "pointer" }}>
                      {expandedFiles[file.id] ? (
                        <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                </div>
                {expandedFiles[file.id] && (
                  <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
                    <iframe
                      src={`https://drive.google.com/file/d/${file.id}/preview`}
                      width="100%"
                      height="800px"
                      title={file.name}
                      style={{ border: "none" }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "red", textAlign: "center" }}>
            No files found.
          </p>
        )}
      </div>
    </div>
  );
}
