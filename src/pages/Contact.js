import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [toast, setToast] = useState({ message: "", visible: false, success: false });

  const showToast = (message, success) => {
    setToast({ message, visible: true, success });
    setTimeout(() => setToast({ message: "", visible: false, success: false }), 3000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      await emailjs.sendForm(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        form.current,
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS public key
      );

      showToast("Your message was sent successfully!", true);
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("Failed to send the message. Please try again.", false);
    }
  };

  return (
    <div
      className="contact-form-container"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "80px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`position-fixed top-0 start-50 translate-middle-x p-3 text-center rounded-2 ${
            toast.success ? "bg-success" : "bg-danger"
          } text-white`}
          style={{ zIndex: 9999 }}
        >
          {toast.message}
        </div>
      )}

      <h1
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        Contact Us
      </h1>

      <form
        ref={form}
        onSubmit={sendEmail}
        style={{
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="user_name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="user_email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          />
        </div>

        {/* Subject Field */}
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          />
        </div>

        {/* Message Field */}
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="5"
            className="form-control"
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-outline-light w-100"
          style={{
            padding: "15px 20px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
