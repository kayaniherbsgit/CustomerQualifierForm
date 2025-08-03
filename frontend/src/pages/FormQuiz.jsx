import { useState, useEffect } from "react";
import axios from "axios";

export default function FormQuiz() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [step, setStep] = useState(0);
  const [leadId, setLeadId] = useState(null);
  const [userMessages, setUserMessages] = useState([]); // ✅ stores answers as chat bubbles

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    problem: "",
    duration: "",
    medications: "",
    feelings: "",
    location: "",
    willingToPay: "",
    customOffer: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [payStep, setPayStep] = useState(false);
  const [idle, setIdle] = useState(false);

  // ✅ Auto-reminder if user goes idle for 15 seconds
  useEffect(() => {
    if (!submitted) {
      const timer = setTimeout(() => setIdle(true), 15000);
      return () => clearTimeout(timer);
    }
  }, [step, formData, submitted]);

  const showTypingThenNext = (nextStep) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(nextStep);
      setIdle(false);
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save instantly to DB after each step
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

    // ✅ show user response in a bubble
    if (formData[field]) {
      setUserMessages((prev) => [
        ...prev,
        { step, text: formData[field] },
      ]);
    }

    if (step === 4) {
      // after problem → go to combined quiz about duration & medication
      showTypingThenNext(5);
    } else if (step === 6) {
      // after emoji feelings → ask location
      showTypingThenNext(7);
    } else if (step === 7) {
      setPayStep(true);
    } else {
      showTypingThenNext(step + 1);
    }
  };

  const handleDecision = async (choice) => {
    await saveProgress({ willingToPay: choice });
    setUserMessages((prev) => [...prev, { step: "payStep", text: choice === "yes" ? "✅ Ndiyo" : "❌ Hapana" }]);
    showTypingThenNext(choice === "yes" ? "priceConfirm" : "notReady");
  };

  const handlePriceDecision = async (choice) => {
    setUserMessages((prev) => [...prev, { step: "priceConfirm", text: choice === "yes" ? "✅ Ndiyo" : "❌ Hapana" }]);
    if (choice === "yes") {
      window.open(
        "https://wa.me/255655889126?text=Nipo%20tayari%20kuanza%20Tiba%2C%20Nipigie%20simu%20sasa%20hivi",
        "_blank"
      );
      setSubmitted(true);
    } else {
      showTypingThenNext("customOffer");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>

        {/* 🟢 Progress bar */}
        {!submitted && (
          <div style={styles.progressWrapper}>
            <div style={{ ...styles.progressBar, width: `${(step / 9) * 100}%` }} />
          </div>
        )}

        {!submitted ? (
          <>
            {typing && <div style={styles.typingBubble}><span></span><span></span><span></span></div>}
            {idle && !typing && <div style={styles.botBubble}>⏳ Dr. Kayani bado nipo hapa, twendelee?</div>}

            {/* 🌿 Intro */}
            {step === 0 && !typing && (
              <div style={styles.botBubble}>
                👋 <b>Karibu Kayani Herbs!</b>  
                Nawasaidia watu wenye changamoto ya <b>vidonda vya tumbo, acid nyingi, kiungulia, gesi, vichomi, tumbo kujaa na hata usingizi kuvurugika usiku.</b>  
                <br /><br />
                Nitakuuliza maswali machache ili nikuelewe zaidi. 
                <button style={styles.nextButton} onClick={() => showTypingThenNext(1)}>👉 Anza</button>
              </div>
            )}

            {/* 1️⃣ Name */}
            {step === 1 && !typing && (
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
                {formData.name && <button style={styles.nextButton} onClick={() => handleNext("name")}>✅ Tayari</button>}
              </div>
            )}

            {/* 2️⃣ Phone */}
            {step === 2 && !typing && (
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
                {formData.phone && <button style={styles.nextButton} onClick={() => handleNext("phone")}>✅ Tayari</button>}
              </div>
            )}

            {/* 3️⃣ Age */}
            {step === 3 && !typing && (
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
                {formData.age && <button style={styles.nextButton} onClick={() => handleNext("age")}>✅ Tayari</button>}
              </div>
            )}

            {/* 4️⃣ Problem */}
            {step === 4 && !typing && (
              <div style={styles.botBubble}>
                😟 Asante {formData.name}! Hebu nielezee tatizo lako?
                <textarea
                  name="problem"
                  placeholder={`Andika changamoto zako hapa ${formData.name}...`}
                  onChange={handleChange}
                  value={formData.problem}
                  style={styles.textarea}
                />
                {formData.problem && <button style={styles.nextButton} onClick={() => handleNext("problem")}>✅ Tayari</button>}
              </div>
            )}

            {/* 5️⃣ Duration & Medication (combined) */}
            {step === 5 && !typing && (
              <div style={styles.botBubble}>
                🕒 Hali hii umekuwa nayo kwa muda gani? Na umewahi kutumia dawa yoyote kutatua hili tatizo? Ni ipi?
                <input
                  type="text"
                  name="duration"
                  placeholder="Mf: Miezi 6, miaka 2..."
                  onChange={handleChange}
                  value={formData.duration}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="medications"
                  placeholder="Andika dawa ulizowahi kutumia..."
                  onChange={handleChange}
                  value={formData.medications}
                  style={styles.input}
                />
                {formData.duration && formData.medications && (
                  <button style={styles.nextButton} onClick={() => handleNext("medications")}>✅ Tayari</button>
                )}
              </div>
            )}

            {/* 7️⃣ Location */}
            {step === 7 && !typing && (
              <div style={styles.botBubble}>
                📍 Je, upo mkoa gani kwa sasa? Ili nijue jinsi ya kukutumia dawa haraka.
                <input
                  type="text"
                  name="location"
                  placeholder="Andika mkoa wako..."
                  onChange={handleChange}
                  value={formData.location}
                  style={styles.input}
                />
                {formData.location && <button style={styles.nextButton} onClick={() => handleNext("location")}>✅ Tayari</button>}
              </div>
            )}

            {/* 8️⃣ Willing to pay */}
            {payStep && !typing && (
              <div style={styles.botBubble}>
                💰 {formData.name}, je upo tayari kuwekeza pesa kutatua changamoto yako?
                {formData.willingToPay === "" && (
                  <div style={styles.buttonGroup}>
                    <button style={{ ...styles.decisionButton, background: "#0a7d36" }}
                      onClick={() => {
                        setFormData({ ...formData, willingToPay: "yes" });
                        handleDecision("yes");
                      }}>✅ Ndiyo</button>
                    <button style={{ ...styles.decisionButton, background: "crimson" }}
                      onClick={() => handleDecision("no")}>❌ Hapana</button>
                  </div>
                )}
                {formData.willingToPay === "yes" && (
                  <p style={styles.successText}>
                    🎉 Hongera kwa kuchukua hatua ya kuanza tiba hii!  
                    Wewe utakuwa miongoni mwa mamia waliotumia tiba hii na kupona kabisa ndani ya wiki 3 tu.
                  </p>
                )}
              </div>
            )}

            {/* 💵 Price confirm */}
            {step === "priceConfirm" && (
              <div style={styles.botBubble}>
                🏷️ Tiba yetu ya <b>{formData.problem}</b> ni TZS 165,000.
                <br />
                Je, uko tayari kulipia kiasi hicho SASA HIVI ili kumjulisha Dr. Kayani akupigie simu?
                <div style={styles.buttonGroup}>
                  <button style={{ ...styles.decisionButton, background: "#0a7d36" }} onClick={() => handlePriceDecision("yes")}>✅ Ndiyo</button>
                  <button style={{ ...styles.decisionButton, background: "crimson" }} onClick={() => handlePriceDecision("no")}>❌ Hapana</button>
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
                {formData.customOffer && <button style={styles.nextButton} onClick={() => setSubmitted(true)}>✅ Tuma</button>}
              </div>
            )}
          </>
        ) : (
          <h2 style={{ color: "#048547", textAlign: "center" }}>
            🎉 Ahsante {formData.name}!  
            Taarifa zako zimepokelewa. Dr. Kayani atakupigia simu hivi karibuni. 📞
          </h2>
        )}

        {/* ✅ User answer bubbles */}
        <div style={styles.answerContainer}>
          {userMessages.map((msg, i) => (
            <div key={i} style={styles.userBubble}>{msg.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#e5ddd5",
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
    position: "relative",
  },
  botBubble: {
    background: "#e6f4ea",
    padding: "15px",
    borderRadius: "15px",
    fontSize: "1.1em",
    animation: "fadeIn 0.4s ease",
  },
  userBubble: {
    background: "#dcf8c6",
    padding: "10px 14px",
    borderRadius: "15px",
    alignSelf: "flex-end",
    maxWidth: "75%",
    fontSize: "1em",
    marginTop: "5px",
    animation: "fadeIn 0.3s ease",
  },
  answerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  typingBubble: {
    background: "#d9fdd3",
    padding: "10px 15px",
    borderRadius: "15px",
    width: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
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
  emojiBar: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    justifyContent: "center",
  },
  progressWrapper: {
    background: "#ddd",
    borderRadius: "20px",
    height: "6px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  progressBar: {
    height: "6px",
    background: "#048547",
    transition: "width 0.3s ease",
  },
  successText: {
    marginTop: "10px",
    color: "#0a7d36",
    fontWeight: "bold",
    fontSize: "1em",
    background: "#eaf8ec",
    padding: "10px",
    borderRadius: "8px",
    animation: "fadeIn 0.6s ease",
  },
};
