import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "acceptance-of-terms", title: "Acceptance of Terms" },
  { id: "user-responsibilities", title: "User Responsibilities" },
  { id: "account-security", title: "Account Security" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "disclaimer-of-warranties", title: "Disclaimer of Warranties" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "changes-to-terms", title: "Changes to Terms" },
  { id: "governing-law", title: "Governing Law" },
];

const TermsOfService = () => {
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
    setTocOpen(false);
  };

  // Function to determine if a TOC link is active
  const isSectionActive = (id) => activeSection === id;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      
      {/* Header */}

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
            <Link to="/terms" className="text-indigo-950 border-b-2 border-indigo-950 pb-1">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-indigo-700 transition duration-150">
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
            <Link to="/terms" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded bg-indigo-50 font-semibold" onClick={() => setNavOpen(false)}>
              Terms of Service
            </Link>
            <Link to="/privacy" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded" onClick={() => setNavOpen(false)}>
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
            
            {/* Desktop TOC */}
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
              <h1 className="text-3xl font-extrabold mb-8 text-indigo-950 border-b pb-3">Terms of Service</h1>
              <p>
                Welcome to the iREQUEST! We're here to provide a seamless way to handle your academic document requests. These Terms of Service ("Terms") outline the rules and guidelines for using our platform. By accessing or using iREQUEST, you agree to follow these Terms.
              </p>
              <p className="mt-4">
                We aim to provide an efficient and secure service for everyone, so we ask that you use the platform responsibly. If you do not agree with these Terms, please refrain from using iREQUEST.
              </p>
            </div>

            <div id="acceptance-of-terms">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the iREQUEST system ("the Service"), you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>

            <div id="user-responsibilities">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">2. User Responsibilities</h2>
              <p>
                As a user of the Service, you are responsible for:
              </p>
              <ul className="list-disc list-outside pl-6 mt-4 space-y-3">
                <li className="pl-2">
                  <span className="font-semibold">Accuracy of Information:</span> Ensuring that all information you provide, 
                  including your name, student number, and contact details, is accurate and truthful.
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Proper Use:</span> Using the Service solely for its intended purpose, which 
                  is to request official academic documents from the Office of the University Registrar 
                  at USTP CDO.
                </li>
                <li className="pl-2">
                  <span className="font-semibold">Prohibited Conduct:</span> You agree not to engage in any fraudulent 
                  activity, including submitting fake payment receipts, or attempting to gain 
                  unauthorized access to the Service or other user accounts.
                </li>
              </ul>
            </div>
            
            <div id="account-security">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">3. Account Security</h2>
              <p>
                You are solely responsible for maintaining the confidentiality of your account credentials (Student ID and Password) and for all activities that occur under your account. You agree to notify the University Registrar immediately of any unauthorized use or security breach. The Service is not liable for any loss or damage arising from your failure to comply with this security obligation.
              </p>
            </div>

            <div id="intellectual-property">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">4. Intellectual Property</h2>
              <p>
                The Service, including its code, design, features, and content, is the exclusive property of the developers and the Office of the University Registrar - USTP CDO. All rights, title, and interest in and to the Service will remain with USTP. You may not copy, modify, distribute, sell, or lease any part of the Service without written permission.
              </p>
            </div>

            <div id="disclaimer-of-warranties">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "as is" basis. USTP and the developers make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </div>

            <div id="limitation-of-liability">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">6. Limitation of Liability</h2>
              <p>
                In no event shall the Office of the University Registrar - USTP CDO or the developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if the Office of the University Registrar - USTP CDO has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div id="changes-to-terms">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">7. Changes to Terms</h2>
              <p>
                The Office of the University Registrar - USTP CDO reserves the right to revise these Terms of Service at any time without prior notice. By continuing to use the Service, you agree to be bound by the then-current version of these Terms.
              </p>
            </div>

            <div id="governing-law">
              <h2 className="text-xl font-extrabold mb-4 text-indigo-950">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </div>
            
            {/* Final Contact Note */}
            <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    If you have any questions regarding these Terms, please contact the Office of the University Registrar directly.
                </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;