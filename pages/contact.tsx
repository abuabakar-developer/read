// pages/contact.tsx
import React from 'react';

const ContactUs = () => {
   return (
      <section id="contact" className="flex flex-col items-center py-16 px-4 bg-gradient-to-b from-green-700 to-green-900 text-white">
         <h2 className="text-4xl font-bold mb-8 text-center">Contact Us</h2>
         <div className="flex flex-col lg:flex-row items-center w-full max-w-5xl">
            {/* Left Column - Contact Info */}
            <div className="lg:w-1/2 flex flex-col items-start space-y-6 mb-8 lg:mb-0">
               <p className="text-lg leading-relaxed">
                  We’re here to help! Reach out to us for any inquiries, feedback, or assistance with your orders. We value our readers and strive to provide the best experience.
               </p>
               <div>
                  <h3 className="text-2xl font-semibold">Our Location</h3>
                  <p className="text-base">123 Book Street, Booktown, BK 12345</p>
               </div>
               <div>
                  <h3 className="text-2xl font-semibold">Contact Information</h3>
                  <p>Email: <a href="mailto:support@abakarreads.com" className="underline">support@abakarreads.com</a></p>
                  <p>Phone: <a href="tel:+123456789" className="underline">+123-456-789</a></p>
               </div>
               <div className="flex space-x-4">
                  {/* Social Icons */}
                  <a href="#" className="text-white hover:text-green-300">Facebook</a>
                  <a href="#" className="text-white hover:text-green-300">Twitter</a>
                  <a href="#" className="text-white hover:text-green-300">Instagram</a>
               </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:w-1/2 w-full">
               <form className="bg-white rounded-lg shadow-lg p-6 space-y-4 text-black">
                  <div>
                     <label className="block text-lg font-semibold mb-1">Name</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" placeholder="Your Name" required />
                  </div>
                  <div>
                     <label className="block text-lg font-semibold mb-1">Email</label>
                     <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" placeholder="Your Email" required />
                  </div>
                  <div>
                     <label className="block text-lg font-semibold mb-1">Message</label>
                     <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700" rows={4} placeholder="Your Message" required />
                  </div>
                  <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">Send Message</button>
               </form>
            </div>
         </div>
      </section>
   );
};

export default ContactUs;
