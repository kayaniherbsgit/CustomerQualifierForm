import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Watch for screen resize (to toggle mobile view)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch leads from backend
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/leads");
        console.log("✅ API Response:", res.data);

        // ✅ Ensure leads is always an array
        const leadsArray = Array.isArray(res.data)
          ? res.data
          : res.data.leads || [];

        setLeads(leadsArray);
        setFilteredLeads(leadsArray);
      } catch (err) {
        console.error("❌ Error fetching leads:", err);
        setError("❌ Could not load leads. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // ✅ Filter leads whenever filter changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredLeads(leads);
    } else if (filter === "yes") {
      setFilteredLeads(leads.filter((l) => l.readyToPay === true));
    } else if (filter === "no") {
      setFilteredLeads(leads.filter((l) => l.readyToPay === false));
    } else if (filter === "pending") {
      setFilteredLeads(leads.filter((l) => l.readyToPay === null));
    }
  }, [filter, leads]);

  // ✅ Status Badge Styling
  const getStatusBadge = (status) => {
    if (status === true)
      return <span style={styles.statusYes}>✅ Yes</span>;
    if (status === false)
      return <span style={styles.statusNo}>❌ No</span>;
    return <span style={styles.statusPending}>⏳ Pending</span>;
  };

  return (
    <div style={{ ...styles.layout, flexDirection: isMobile ? "column" : "row" }}>
      {/* ✅ SIDEBAR (hidden on mobile) */}
      {!isMobile && (
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Kayani Admin</h2>
          <ul style={styles.navList}>
            <li style={styles.navItem}>📊 Dashboard</li>
            <li style={{ ...styles.navItem, ...styles.navActive }}>📋 Leads</li>
            <li style={styles.navItem}>⚙️ Settings</li>
          </ul>
        </aside>
      )}

      {/* ✅ MAIN DASHBOARD */}
      <main style={{ ...styles.main, width: isMobile ? "100%" : "auto" }}>
        {/* ✅ MOBILE TOP BAR */}
        {isMobile && (
          <div style={styles.mobileTopBar}>
            <h2 style={{ color: "#048547" }}>☰ Menu</h2>
          </div>
        )}

        {/* ✅ HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>Leads Dashboard</h1>
          <p style={styles.subtitle}>Manage, filter, and review all customer leads.</p>
        </div>

        {/* ✅ FILTER BUTTONS */}
        <div
          style={{
            ...styles.filterBar,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          {[
            { key: "all", label: "All", color: "#048547" },
            { key: "yes", label: "✅ YES", color: "green" },
            { key: "no", label: "❌ NO", color: "crimson" },
            { key: "pending", label: "⏳ Pending", color: "gray" },
          ].map((btn) => (
            <button
              key={btn.key}
              style={{
                ...styles.filterButton,
                background: filter === btn.key ? btn.color : "#f3f3f3",
                color: filter === btn.key ? "#fff" : "#333",
                width: isMobile ? "100%" : "auto",
              }}
              onClick={() => setFilter(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ✅ TABLE OR MESSAGES */}
        <div style={styles.tableWrapper}>
          {loading ? (
            <p style={styles.loading}>⏳ Loading leads...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Age</th>
                    <th style={styles.th}>Problem</th>
                    <th style={styles.th}>Ready to Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredLeads) && filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr key={lead._id} style={styles.row}>
                        <td style={styles.td}>{lead.name}</td>
                        <td style={styles.td}>{lead.phone}</td>
                        <td style={styles.td}>{lead.age}</td>
                        <td style={styles.td}>{lead.problem}</td>
                        <td style={styles.td}>{getStatusBadge(lead.readyToPay)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={styles.noLeads}>
                        🚫 No leads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f9fafb",
  },
  sidebar: {
    width: "240px",
    background: "#ffffff",
    borderRight: "1px solid #eee",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
  },
  sidebarTitle: {
    fontSize: "1.3em",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#048547",
  },
  navList: { listStyle: "none", padding: 0 },
  navItem: { padding: "10px 0", color: "#555" },
  navActive: { fontWeight: "bold", color: "#048547" },

  mobileTopBar: {
    background: "#fff",
    padding: "15px",
    borderBottom: "1px solid #eee",
    textAlign: "left",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    marginBottom: "15px",
  },

  main: { flex: 1, padding: "20px" },

  header: { marginBottom: "15px" },
  title: { fontSize: "1.6em", fontWeight: "bold", marginBottom: "5px" },
  subtitle: { color: "#777", fontSize: "0.95em" },

  filterBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  filterButton: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },

  tableWrapper: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
    padding: "10px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95em",
    minWidth: "600px",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "bold",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f1f1f1",
  },
  row: { transition: "background 0.2s ease" },
  noLeads: { textAlign: "center", padding: "20px", color: "#aaa" },

  loading: { textAlign: "center", padding: "20px", fontWeight: "bold", color: "#555" },
  error: { textAlign: "center", padding: "20px", color: "crimson", fontWeight: "bold" },

  statusYes: {
    background: "#e6f7e9",
    color: "green",
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  statusNo: {
    background: "#fde8e8",
    color: "crimson",
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  statusPending: {
    background: "#f1f1f1",
    color: "gray",
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
};
