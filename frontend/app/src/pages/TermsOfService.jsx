import { useEffect, useState } from "react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="relative z-10 w-full bg-white shadow">
        <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="h-9 flex items-center">
            <img
              src="/logo.png"
              alt="iRequest Logo"
              className="h-28 md:h-28 lg:h-36 w-auto -ml-2 mt-2 md:mt-4 md:scale-[1.5] origin-left"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-lg text-gray-800">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/terms" className="hover:underline text-blue-700">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:underline mr-20">
              Privacy Policy
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setNavOpen(!navOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {navOpen && (
          <div className="md:hidden bg-white shadow px-4 py-2 space-y-2">
            <Link to="/" className="block hover:underline">
              Home
            </Link>
            <Link to="/terms" className="block hover:underline">
              Terms of Service
            </Link>
            <Link to="/privacy" className="block hover:underline">
              Privacy Policy
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full overflow-y-auto px-4 md:px-12 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 w-full max-w-6xl mx-auto md:ml-30">
          {/* Table of Contents */}
          <aside className="w-full">
            {/* Desktop TOC */}
            <div className="hidden md:block sticky top-24 text-left md:ml-15">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 md:-ml-5 inter-font">
                Table of Contents
              </h2>
              <div className="text-gray-500 md:-ml-2 -mt-1">Introduction</div>
              <nav className="space-y-0">
                {sections.map((s, index) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-gray-500 hover:underline"
                  >
                    {index + 1}. {s.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Mobile TOC Dropdown */}
            <div className="md:hidden mb-6">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full flex justify-between items-center px-4 py-2 border-b"
              >
                <span className="font-semibold text-gray-800">
                  Table of Contents
                </span>
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
                <div className="mt-2 space-y-2">
                  {sections.map((s, index) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-blue-700 hover:underline"
                      onClick={() => setTocOpen(false)}
                    >
                      {index + 1}. {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Sections */}
          <section className="space-y-8 max-w-2xl text-justify text-base md:text-md leading-relaxed mx-auto">
            <div id="introduction">
              <h1 className="text-2xl font-extrabold mb-6 text-blue-950  ">Terms of Service</h1>
              <p>
                Welcome to the iREQUEST! We're here to provide a seamless way to handle your academic document requests. These Terms of Service ("Terms") outline the rules and guidelines for using our platform. By accessing or using iREQUEST, you agree to follow these Terms.
              </p>
              <p className="mt-4">
                We aim to provide an efficient and secure service for everyone, so we ask that you use the platform responsibly. If you do not agree with these Terms, please refrain from using iREQUEST.
              </p>
            </div>

            <div id="acceptance-of-terms">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the iREQUEST system ("the Service"), you agree to be bound by these Terms of Service ("Terms") and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>

            <div id="user-responsibilities">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">2. User Responsibilities</h2>
              <p className="-mb-5">
                As a user of the Service, you are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>
                  Accuracy of Information: Ensuring that all information you provide, 
                  including your name, student number, and contact details, is accurate and truthful.
                </li>
                <li>
                  Proper Use Using the Service solely for its intended purpose, which 
                  is to request official academic documents from the Office of the University Registrar 
                  at USTP CDO.
                </li>
                <li>
                  Prohibited Conduct: You agree not to engage in any fraudulent 
                  activity, including submitting fake payment receipts, or attempting to gain 
                  unauthorized access to the Service or other user accounts.
                </li>
              </ul>
            </div>

            <div id="intellectual-property">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">4. Intellectual Property</h2>
              <p>
                The Service, including its code, design, features, and content, is the exclusive property of the developers and the Office of the University Registrar - USTP CDO. All rights, title, and interest in and to the Service will remain with USTP. You may not copy, modify, distribute, sell, or lease any part of the Service without written permission.
              </p>
            </div>

            <div id="disclaimer-of-warranties">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided on an "as is" basis. USTP and the developers make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </div>

            <div id="limitation-of-liability">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">6. Limitation of Liability</h2>
              <p>
                In no event shall the Office of the University Registrar - USTP CDO or the developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if the Office of the University Registrar - USTP CDO has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div id="changes-to-terms">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">7. Changes to Terms</h2>
              <p>
                The Office of the University Registrar - USTP CDO reserves the right to revise these Terms of Service at any time without prior notice. By continuing to use the Service, you agree to be bound by the then-current version of these Terms.
              </p>
            </div>

            <div id="governing-law">
              <h2 className="text-xl font-bold mb-6 text-blue-950 inter-font">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
