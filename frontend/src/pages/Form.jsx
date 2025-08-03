import { useState } from "react";
import axios from "axios";

export default function FormQuiz() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [step, setStep] = useState(0);
  const [leadId, setLeadId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    problem: "",
    willingToPay: "",
    customOffer: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payStep, setPayStep] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save progress after each step (instant save)
  const saveProgress = async (updatedData) => {
    try {
      if (!leadId) {
        const res = await axios.post(`${API_URL}/api/leads`, updatedData);
        setLeadId(res.data.lead._id);
      } else {
        await axios.patch(`${API_URL}/api/leads/${leadId}`, updatedData);
      }
    } catch (err) {
      console.error("❌ Error saving progress:", err.message);
    }
  };

  const handleNext = async (field) => {
    await saveProgress({ [field]: formData[field] });

    if (step === 4) {
      setPayStep(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleDecision = async (choice) => {
    await saveProgress({ willingToPay: choice });
    if (choice === "yes") {
      setStep("priceConfirm");
    } else {
      setStep("notReady");
    }
  };

  const handlePriceDecision = async (choice) => {
    if (choice === "yes") {
      window.open(
        "https://wa.me/255655889126?text=Nipo%20tayari%20kuanza%20Tiba%2C%20Nipigie%20simu%20sasa%20hivi",
        "_blank"
      );
      setSubmitted(true);
    } else {
      setStep("customOffer");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>
        {!submitted ? (
          <>
            {/* 🌿 Intro */}
            {step === 0 && (
              <div style={styles.botBubble}>
                🌿 <b>Karibu Kayani Herbs!</b> Nawasaidia watu wenye changamoto ya
                vidonda vya tumbo, acid nyingi tumboni, kiungulia kikali, vichomi,
                gesi nyingi, tumbo kujaa na hata usingizi kuvurugika usiku.
                <br />
                <br />
                Nitakuuliza maswali machache ili nikuelewe zaidi.
                <button
                  style={styles.nextButton}
                  onClick={() => setStep(1)}
                >
                  Anza 👉
                </button>
              </div>
            )}

            {/* 1️⃣ Name */}
            {step === 1 && (
              <div style={styles.botBubble}>
                👉 Wewe unaitwa nani?
                <input
                  type="text"
                  name="name"
                  placeholder="Andika jina lako hapa..."
                  onChange={handleChange}
                  value={formData.name}
                  style={styles.input}
                />
                {formData.name && (
                  <button
                    style={styles.nextButton}
                    onClick={() => handleNext("name")}
                  >
                    ✅ Tayari
                  </button>
                )}
              </div>
            )}

            {/* 2️⃣ Phone */}
            {step === 2 && (
              <div style={styles.botBubble}>
                📞 Sasa {formData.name}, naomba namba yako ya simu?
                <input
                  type="text"
                  name="phone"
                  placeholder={`Andika namba yako hapa ${formData.name}...`}
                  onChange={handleChange}
                  value={formData.phone}
                  style={styles.input}
                />
                {formData.phone && (
                  <button
                    style={styles.nextButton}
                    onClick={() => handleNext("phone")}
                  >
                    ✅ Tayari
                  </button>
                )}
              </div>
            )}

            {/* 3️⃣ Age */}
            {step === 3 && (
              <div style={styles.botBubble}>
                🎂 Vizuri {formData.name}! Una miaka mingapi?
                <input
                  type="number"
                  name="age"
                  placeholder={`Andika umri wako hapa ${formData.name}...`}
                  onChange={handleChange}
                  value={formData.age}
                  style={styles.input}
                />
                {formData.age && (
                  <button
                    style={styles.nextButton}
                    onClick={() => handleNext("age")}
                  >
                    ✅ Tayari
                  </button>
                )}
              </div>
            )}

            {/* 4️⃣ Problem */}
            {step === 4 && (
              <div style={styles.botBubble}>
                😟 Asante {formData.name}! Hebu nielezee tatizo lako?
                <textarea
                  name="problem"
                  placeholder={`Andika changamoto zako hapa ${formData.name}...`}
                  onChange={handleChange}
                  value={formData.problem}
                  style={styles.textarea}
                />
                {formData.problem && (
                  <button
                    style={styles.nextButton}
                    onClick={() => handleNext("problem")}
                  >
                    ✅ Tayari
                  </button>
                )}
              </div>
            )}

            {/* 5️⃣ Are you willing to invest? */}
            {payStep && (
              <div style={styles.botBubble}>
                💰 {formData.name}, je upo tayari kuwekeza pesa kutatua
                changamoto yako?
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.decisionButton, background: "#0a7d36" }}
                    onClick={() => handleDecision("yes")}
                  >
                    ✅ Ndiyo
                  </button>
                  <button
                    style={{ ...styles.decisionButton, background: "crimson" }}
                    onClick={() => handleDecision("no")}
                  >
                    ❌ Hapana
                  </button>
                </div>
              </div>
            )}

            {/* 💵 Price Confirmation */}
            {step === "priceConfirm" && (
              <div style={styles.botBubble}>
                🏷️ Tiba yetu ya <b>{formData.problem}</b> ni TZS 165,000.
                <br />
                Je, uko tayari kulipia kiasi hicho SASA HIVI ili kuanza tiba na
                kumjulisha Dr. Kayani akupigie simu?
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.decisionButton, background: "#0a7d36" }}
                    onClick={() => handlePriceDecision("yes")}
                  >
                    ✅ Ndiyo
                  </button>
                  <button
                    style={{ ...styles.decisionButton, background: "crimson" }}
                    onClick={() => handlePriceDecision("no")}
                  >
                    ❌ Hapana
                  </button>
                </div>
              </div>
            )}

            {/* 🙅 Not ready */}
            {step === "notReady" && (
              <div style={styles.botBubble}>
                Sawa sawa {formData.name}, naelewa kabisa…  
                🥺 Ni kiasi gani uko tayari kulipia kwa sasa ili tuanze tiba?
                <input
                  type="text"
                  name="customOffer"
                  placeholder="Andika kiasi chako hapa..."
                  onChange={handleChange}
                  value={formData.customOffer}
                  style={styles.input}
                />
                {formData.customOffer && (
                  <button
                    style={styles.nextButton}
                    onClick={() => setSubmitted(true)}
                  >
                    ✅ Tuma
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <h2 style={{ color: "#048547" }}>
            ✅ Ahsante {formData.name}! Taarifa zako zimepokelewa. Dr. Kayani
            atakupigia simu hivi karibuni. 📞
          </h2>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f0f2f5",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  chatBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  botBubble: {
    background: "#e6f4ea",
    padding: "15px",
    borderRadius: "15px",
    fontSize: "1.1em",
    animation: "fadeIn 0.3s ease-in",
  },
  input: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "1em",
  },
  textarea: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minHeight: "80px",
    width: "100%",
    fontSize: "1em",
  },
  nextButton: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#048547",
    color: "#fff",
    fontSize: "1em",
    cursor: "pointer",
  },
  decisionButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    fontSize: "1em",
    cursor: "pointer",
  },
  buttonGroup: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
};
