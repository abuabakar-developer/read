import React, { useState, useRef } from "react";
import { ContactUs } from "./ContactUs";
import FAQ from "./FAQ"; // Import the FAQ component

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false); // State to manage FAQ visibility
  const contactUsRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null); // Ref for the FAQ section

  const handleScrollToContact = () => {
    setShowContact(true);
    setTimeout(() => {
      contactUsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleToggleFAQ = () => {
    setShowFAQ((prev) => !prev); // Toggle the visibility of FAQ
    if (!showFAQ) {
      setTimeout(() => {
        faqRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to FAQ section if it becomes visible
      }, 100);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setMessage(result.message || "Subscription successful!");

      if (response.status !== 200) {
        setMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setMessage("Error subscribing. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <>
      <footer className="bg-white text-gray-800 p-10 md:p-16 rounded-t-lg shadow-lg">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-300 pt-8">
          {/* About Section */}
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-green-900">ABreads</h2>
            <p className="text-gray-700">Discover your next favorite book and enjoy exclusive discounts.</p>
            <nav>
              <ul className="flex flex-col space-y-3 items-center md:items-start">
                <li className="w-full py-2 text-center transition hover:bg-gray-100 rounded-md">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full text-lg font-medium text-gray-800 hover:text-green-500"
                  >
                    Home
                  </button>
                </li>
                <li className="w-full py-2 text-center transition hover:bg-gray-100 rounded-md">
                  <button
                    onClick={handleToggleFAQ} // Toggle FAQ visibility
                    className="w-full text-lg font-medium text-gray-800 hover:text-green-500"
                  >
                    FAQs
                  </button>
                </li>
                <li className="w-full py-2 text-center transition hover:bg-gray-100 rounded-md">
                  <button
                    onClick={handleScrollToContact}
                    className="w-full text-lg font-medium text-gray-800 hover:text-green-500"
                  >
                    Contact Us
                  </button>
                </li>
                <a href="#featured" className="w-full py-2 text-center transition hover:bg-gray-100 hover:text-green rounded-md">
                 Books
              </a>
              </ul>
            </nav>
          </div>

          {/* Subscription Section */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md text-center md:text-left">
            <h3 className="text-2xl font-semibold text-gray-900">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col items-center md:items-start space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded border border-gray-400 focus:outline-none focus:ring focus:ring-green-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className={`w-full md:w-auto px-5 py-2 font-semibold rounded transition duration-300 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
              {message && <p className="mt-2 text-gray-600 text-sm">{message}</p>}
            </form>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-left space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
                <a key={platform} href={`https://${platform}.com`} className="text-gray-600 hover:text-green-500 transition duration-300" aria-label={platform}>
                  <i className={`fab fa-${platform} fa-lg`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-300 pt-4">
          &copy; {new Date().getFullYear()} AbReads. All rights reserved.
        </div>
      </footer>

      {/* Conditionally Render FAQ Section */}
      {showFAQ && (
        <div ref={faqRef}>
          <FAQ />
        </div>
      )}

      {/* Conditionally Render ContactUs Section */}
      {showContact && <ContactUs ref={contactUsRef} />}
    </>
  );
};

export default Footer;


