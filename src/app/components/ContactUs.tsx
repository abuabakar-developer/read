import React, { forwardRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the ContactUsProps type. Add any additional fields as needed.
interface ContactUsProps {
  name?: string;
  email?: string;
}

export const ContactUs = forwardRef<HTMLElement, React.PropsWithChildren<ContactUsProps>>(
  (props, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      // Simulate form submission delay
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Thank you for your message! We will get back to you soon.', {
          position: 'top-center',
          autoClose: 5000,
        });
      }, 1500);
    };

    return (
      <section
        ref={ref}
        id="contact"
        className="flex flex-col items-center py-16 px-6 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 transition-colors duration-500"
      >
        <ToastContainer />
        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center text-green-800 leading-snug">
          We&apos;d Love to Hear from You!
        </h2>

        <div className="flex flex-col lg:flex-row items-center w-full max-w-5xl space-y-8 lg:space-y-0 lg:space-x-10">
          {/* Information Section */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start space-y-6 px-6 text-center lg:text-left">
            <p className="text-lg lg:text-xl leading-relaxed text-gray-700">
              Whether you have a question about our bookstore, need assistance, or just want to chat about books, we&apos;re here for you!
            </p>
            <div>
              <h3 className="text-lg font-semibold text-green-700">Our Location</h3>
              <p className="text-sm text-gray-600">123 Book Street, Booktown, BK 12345</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">Contact Information</h3>
              <p className="text-sm">
                Email: <a href="mailto:support@abakarreads.com" className="text-green-600 hover:text-green-800">support@abakarreads.com</a>
              </p>
              <p className="text-sm">
                Phone: <a href="tel:+123456789" className="text-green-600 hover:text-green-800">+123-456-789</a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-1/2 w-full px-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-gray-800 hover:shadow-2xl transition-shadow duration-300"
            >
              <div>
                <label className="block text-base font-medium mb-2 text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-2 text-gray-700">Message</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200"
                  rows={5}
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 ${
                  isSubmitting ? 'cursor-wait' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loader h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin inline-block"></span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
);

ContactUs.displayName = 'ContactUs';

export default ContactUs;



