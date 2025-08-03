import { useState } from "react";
import axios from "axios";

export default function Form() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    problem: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/leads", formData);
      setLeadId(res.data.lead._id);
      setSubmitted(true);
      setMessage("✅ Information sent successfully!");
    } catch (err) {
      console.error("❌ Error saving lead:", err.response ? err.response.data : err.message);
      setMessage("❌ Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (choice) => {
    try {
      await axios.patch(`http://localhost:5000/api/leads/${leadId}`, {
        readyToPay: choice === "yes",
      });

      if (choice === "yes") {
        window.open("https://wa.me/255655889126?text=Nipo%20tayari%20kulipia%20tiba", "_blank");
      } else {
        window.open("https://chat.whatsapp.com/yourgrouplink", "_blank");
      }
    } catch (err) {
      console.error("❌ Error updating status:", err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>🌿 Order Now</h2>

            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={styles.input}/>
            <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required style={styles.input}/>
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required style={styles.input}/>
            <textarea name="problem" placeholder="Describe Your Problem" onChange={handleChange} required style={styles.textarea} />

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "⏳ Sending..." : "Submit"}
            </button>

            {message && <p style={styles.message}>{message}</p>}
          </form>
        ) : (
          <div style={styles.decisionBox}>
            <h3>Are you ready to pay <span style={{ color: "#0a7d36" }}>TZS 165,000</span> to solve this problem?</h3>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleDecision("yes")} style={{ ...styles.button, background: "#0a7d36" }}>✅ YES</button>
              <button onClick={() => handleDecision("no")} style={{ ...styles.button, background: "crimson" }}>❌ NO</button>
            </div>
            {message && <p style={styles.message}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f7f9f9",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    fontSize: "1.8em",
    marginBottom: "10px",
    color: "#048547",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1em",
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "1em",
    minHeight: "80px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#048547",
    color: "white",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#048547",
  },
  decisionBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
};
