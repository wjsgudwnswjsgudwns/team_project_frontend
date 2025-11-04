import React, { useState } from "react";
import "./AiConsult.css";

function AiConsult() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요! 저는 Opticore AI 견적 도우미입니다 😊\n원하시는 PC 예산대나 용도를 입력해주세요.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // AI 답변 예시 (나중에 API 연동 가능)
    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: `좋아요! "${input}" 관련해서 추천 견적을 분석 중입니다... (AI 응답 예시)`,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="ai-consult-container">
      <div className="chat-box">
        <h2 className="chat-title">💬 AI 컴퓨터 견적 상담</h2>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="예: 150~200만원대 게이밍 PC 견적 추천해줘"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSend}>전송</button>
        </div>
      </div>
    </div>
  );
}

export default AiConsult;
