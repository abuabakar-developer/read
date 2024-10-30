import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqData = [
    {
        question: "What types of books do you offer?",
        answer: "We offer a wide range of books across various genres, including fiction, non-fiction, self-help, children's books, and more."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order has been shipped, you will receive an email with a tracking number and a link to track your order online."
    },
    {
        question: "What is your return policy?",
        answer: "You can return any book within 30 days of purchase for a full refund, provided it is in its original condition."
    },
    {
        question: "Do you offer gift cards?",
        answer: "Yes! We offer gift cards that can be purchased on our website. They can be redeemed at any time."
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team via email at support@abakarreads.com or through our contact form."
    },
    {
        question: "Do you have a loyalty program?",
        answer: "Yes, we have a loyalty program where you can earn points for every purchase, which can be redeemed for discounts on future orders."
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 md:py-24 bg-gray-100">
            <div className="max-w-4xl mx-auto px-6 md:px-10">
                <h2 className="text-4xl font-bold text-center mb-10 text-green-800">
                    Frequently Asked Questions
                </h2>
                <p className="text-center mb-12 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Here are answers to the questions we get asked the most. If you have more questions, please reach out to us at <a href="mailto:support@abakarreads.com" className="text-green-700 underline">support@abakarreads.com</a>.
                </p>
                <div className="space-y-6">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                        >
                            <div
                                className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-green-100 transition-colors duration-300"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-green-800 flex-1">
                                    {faq.question}
                                </h3>
                                <span
                                    className={`text-green-600 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}
                                >
                                    {openIndex === index ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                                </span>
                            </div>
                            {openIndex === index && (
                                <div className="p-5 bg-gray-50 text-gray-700 border-t border-gray-200 transition-all duration-300 ease-in-out">
                                    <p className="text-base md:text-lg leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;

