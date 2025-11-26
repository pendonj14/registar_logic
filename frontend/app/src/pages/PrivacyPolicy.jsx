import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";



const sections = [

  { id: "information-collected", title: "Information Collected" },

  { id: "use-of-data", title: "Use of Your Information" },

  { id: "data-sharing", title: "Data Sharing and Disclosure" },

  { id: "data-security", title: "Data Security" },

  { id: "data-retention", title: "Data Retention" },

  { id: "your-rights", title: "Your Rights" },

  { id: "changes-to-policy", title: "Changes to This Policy" },

  { id: "contact-information", title: "Contact Information" },

];



const PrivacyPolicy = () => {

  const [navOpen, setNavOpen] = useState(false);

  const [tocOpen, setTocOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('introduction');



  useEffect(() => {

    window.scrollTo(0, 0);

  }, []);



  // Simple Scroll-to-section handler

  const handleScrollTo = (id) => {

    const element = document.getElementById(id);

    if (element) {

      // Use scrollIntoView, ensuring the header doesn't cover the anchor

      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setActiveSection(id);

    }

    setTocOpen(false);

  };



  // Function to determine if a TOC link is active

  const isSectionActive = (id) => activeSection === id;



  return (

    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

     

      {/* Header*/}

      <header className="sticky top-0 z-20 w-full bg-white shadow">

        <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">

          <div className="h-9 flex items-center">

            <img

              src="/logo.png"

              alt="iRequest Logo"

              className="h-28 -ml-2 mt-2 md:h-36 w-auto transform md:scale-[1.5] origin-left md:mt-4"

            />

          </div>



          {/* Desktop Nav */}

          <nav className="hidden md:flex gap-6 text-base font-medium text-indigo-950">

            <Link to="/" className="hover:text-indigo-700 transition duration-150">

              Home

            </Link>

            <Link to="/terms" className="hover:text-indigo-700 transition duration-150">

              Terms of Service

            </Link>

            {/* Highlighted as active page */}

            <Link to="/privacy" className="text-indigo-950 border-b-2 border-indigo-950 pb-1">

              Privacy Policy

            </Link>

          </nav>



          {/* Mobile Menu Button */}

          <button

            className="md:hidden p-2 text-indigo-950"

            onClick={() => setNavOpen(!navOpen)}

            aria-label="Toggle navigation menu"

          >

            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />

            </svg>

          </button>

        </div>



        {/* Mobile Nav Dropdown */}

        {navOpen && (

          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 px-4 py-3 space-y-2 absolute w-full z-10">

            <Link to="/" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded" onClick={() => setNavOpen(false)}>

              Home

            </Link>

            <Link to="/terms" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded" onClick={() => setNavOpen(false)}>

              Terms of Service

            </Link>

            <Link to="/privacy" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded bg-indigo-50 font-semibold" onClick={() => setNavOpen(false)}>

              Privacy Policy

            </Link>

          </div>

        )}

      </header>



      {/* Main Content Layout */}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">

         

          {/* Table of Contents (TOC) Sidebar */}

          <aside className="w-full">

           

            {/* Desktop TOC - sticky top is now 24 (6rem) due to the header height */}

            <div className="hidden md:block sticky top-24 p-4 border border-gray-200 bg-white rounded-lg shadow-sm">

              <h2 className="text-lg font-extrabold text-indigo-950 mb-4 border-b pb-2">

                Table of Contents

              </h2>

              <nav className="space-y-2 text-sm">

                <a

                  href="#introduction"

                  onClick={(e) => { e.preventDefault(); handleScrollTo('introduction'); }}

                  className={`block transition duration-150 ${isSectionActive('introduction') ? 'text-indigo-800 font-bold' : 'text-gray-600 hover:text-indigo-700'}`}

                >

                  Introduction

                </a>

                {sections.map((s, index) => (

                  <a

                    key={s.id}

                    href={`#${s.id}`}

                    onClick={(e) => { e.preventDefault(); handleScrollTo(s.id); }}

                    className={`block transition duration-150 pl-2 border-l-2 ${isSectionActive(s.id) ? 'text-indigo-800 font-bold border-indigo-800' : 'text-gray-600 hover:text-indigo-700 border-gray-300'}`}

                  >

                    {index + 1}. {s.title}

                  </a>

                ))}

              </nav>

            </div>



            {/* Mobile TOC Dropdown */}

            <div className="md:hidden mb-8 border border-gray-300 rounded-lg bg-white shadow-sm">

              <button

                onClick={() => setTocOpen(!tocOpen)}

                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-indigo-950"

              >

                <span>Table of Contents</span>

                <svg

                  className={`h-5 w-5 transform transition-transform ${tocOpen ? "rotate-180" : ""}`}

                  fill="none"

                  stroke="currentColor"

                  viewBox="0 0 24 24"

                >

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />

                </svg>

              </button>

              {tocOpen && (

                <div className="mt-2 space-y-2 p-4 border-t border-gray-200">

                  <a

                    href="#introduction"

                    onClick={(e) => { e.preventDefault(); handleScrollTo('introduction'); }}

                    className={`block text-sm hover:text-indigo-800 ${isSectionActive('introduction') ? 'font-bold text-indigo-800' : 'text-gray-700'}`}

                  >

                    Introduction

                  </a>

                  {sections.map((s, index) => (

                    <a

                      key={s.id}

                      href={`#${s.id}`}

                      onClick={(e) => { e.preventDefault(); handleScrollTo(s.id); }}

                      className={`block text-sm hover:text-indigo-800 ${isSectionActive(s.id) ? 'font-bold text-indigo-800' : 'text-gray-700'}`}

                    >

                      {index + 1}. {s.title}

                    </a>

                  ))}

                </div>

              )}

            </div>

          </aside>



          {/* Policy Sections */}

          <section className="space-y-12 text-gray-700 leading-relaxed text-base">

            <div id="introduction">

              <h1 className="text-3xl font-extrabold mb-8 text-indigo-950 border-b pb-3">Privacy Policy</h1>

              <p>

                The iREQUEST platform ("the Service"), operated by the Office of the University Registrar - USTP CDO, is committed to protecting your privacy. This policy explains what information we collect from you, how we use and safeguard that information, and your rights concerning your personal data when you use our digital academic document request service.

              </p>

              <p className="mt-4">

                By using the Service, you consent to the data practices described in this policy.

              </p>

            </div>



            <div id="information-collected">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">1. Information We Collect</h2>

              <p>We collect necessary information to process your requests efficiently:</p>

              <ul className="list-disc list-outside pl-6 mt-4 space-y-3">

                <li className="pl-2">

                  <span className="font-semibold">Identity and Contact Data:</span> This includes your full name, student identification number, course, year, email address, and phone number, which are essential for verifying your identity and processing official documents.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Request Data:</span> Details about the documents you request (e.g., Transcript of Records, Diploma copy) and the purpose of the request.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Payment Status Data:</span> We record the status of your payment (e.g., verified/pending) and the provided proof of payment (e.g., scanned receipt/reference number). *Note: We do not store or process your sensitive financial details, such as credit card numbers.*

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Usage Data:</span> Information about how you access and use the Service, such as access times, duration, and pages viewed, used for system improvement.

                </li>

              </ul>

            </div>



            <div id="use-of-data">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">2. How We Use Your Information</h2>

              <p>Your data is used strictly for the following purposes:</p>

              <ul className="list-disc list-outside pl-6 mt-4 space-y-3">

                <li className="pl-2">

                  <span className="font-semibold">Processing Requests:</span> To verify your identity, confirm your student records, and fulfill your academic document requests.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Communication:</span> To notify you about the status of your request, payment verification, and scheduling for document collection.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Service Improvement:</span> To analyze platform usage and technical performance to enhance system reliability and user experience.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Legal Compliance:</span> To comply with legal obligations and internal auditing requirements mandated by the University.

                </li>

              </ul>

            </div>



            <div id="data-sharing">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">3. Data Sharing and Disclosure</h2>

              <p>Your personal data is handled confidentially and will not be sold, rented, or leased to third parties. We may disclose your data only in the following, necessary situations:</p>

              <ul className="list-disc list-outside pl-6 mt-4 space-y-3">

                <li className="pl-2">

                  <span className="font-semibold">Internal University Departments:</span> Sharing necessary information with the relevant University offices (e.g., Cashier's Office for payment confirmation) required to complete your request.

                </li>

                <li className="pl-2">

                  <span className="font-semibold">Legal Requirements:</span> When required by law or in response to valid requests by public authorities (e.g., a court order).

                </li>

              </ul>

            </div>



            <div id="data-security">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">4. Data Security</h2>

              <p>

                We employ reasonable technical and organizational measures designed to protect your Personal Data from unauthorized access, loss, misuse, alteration, or disclosure. These measures include data encryption (SSL/TLS) and restricted access controls. However, no electronic transmission or storage system is 100% secure, and we cannot guarantee absolute security.

              </p>

            </div>



            <div id="data-retention">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">5. Data Retention</h2>

              <p>

                We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy, including retaining data to comply with our legal and regulatory obligations, resolve disputes, and enforce our agreements, in accordance with the University's record-keeping policies.

              </p>

            </div>



            <div id="your-rights">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">6. Your Rights</h2>

              <p>

                You have the right to request access to the Personal Data we hold about you and to request correction of any inaccurate or incomplete data. Please direct any such requests to the Office of the University Registrar.

              </p>

            </div>



            <div id="changes-to-policy">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">7. Changes to This Policy</h2>

              <p>

                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.

              </p>

            </div>



            <div id="contact-information">

              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">8. Contact Information</h2>

              <p>

                If you have any questions about this Privacy Policy, please contact us directly:

              </p>

              <ul className="list-disc list-outside pl-6 mt-4 space-y-1">

                <li className="pl-2">

                  <span className="font-semibold">By Email:</span> [registraroffice1@ustp.edu.ph]

                </li>

                <li className="pl-2">

                  <span className="font-semibold">By Phone:</span> [+63 (088) 8571738 Local 137]

                </li>

              </ul>

            </div>



           

            {/* Final Contact Note */}

            <div className="pt-4 border-t border-gray-200">

                <p className="text-sm text-gray-500">

                    Last Updated: November 2025

                </p>

            </div>

          </section>

        </div>

      </main>

    </div>

  );

};



export default PrivacyPolicy;