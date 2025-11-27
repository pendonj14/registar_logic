import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, UploadCloud, CheckSquare, Square, ChevronDown, ChevronUp, Info } from 'lucide-react';
import axiosInstance from '../utils/axios';
import RequirementsModal from './RequirementsModal';
import toast, {Toaster} from 'react-hot-toast';

// Moved outside component to be stable and accessible
const documentOptions = [
  {
    label: "Walk-in / Personal Processing (Info Only)",
    options: [
      "Diploma Replacement (P100)",
      "CAV Certification (P125)",
      "Authentication (P5/pg)"
    ]
  },
  {
    label: "Major Documents",
    options: [
      "Form 137 (P100)",
      "Evaluation (P50)",
      "Honorable Dismissal (P100)",
      "Correction of Name (P100)",
      "Transcript of Records (P125/pg)",
      "Permit to Study (P100)",
      "Rush Fee (P100)"
    ]
  },
  {
    label: "Certifications (P80)",
    options: [
      "Certification of Grades (CAR)",
      "Certification of GPA",
      "Certification of Endorsement",
      "Certification of Officially Enrolled",
      "Certification of Subjects Enrolled",
      "Certification of USTP Conversion",
      "Certification of English Medium",
      "Letter of No Objection",
      "Certification of Graduation",
      "Certification of Earned Units",
      "Certification of Grading System",
      "Certification of Subjects w/ Grades",
      "Authorization Letter",
      "Others"
    ]
  }
];

const restrictedDocuments = [
  "Diploma Replacement (P100)",
  "Authentication (P5/pg)",
  "CAV Certification (P125)"
];

const exemptDocuments = [
  "Honorable Dismissal (P100)",
  "Correction of Name (P100)",
  "Permit to Study (P100)"
];

const RequestDocumentModal = ({ isOpen, onClose, onSuccess, userProgram}) => {
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [selectedRestrictedDoc, setSelectedRestrictedDoc] = useState("");

  const [formData, setFormData] = useState({
    request: [], 
    custom_request: '', 
    year_level: '1st Year',
    college_program: '',
    is_graduate: false,
    last_attended: '',
    clearance_status: false,
    affiliation: 'Student',
    request_purpose: ''
  });

  const [clearanceImage, setClearanceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 

  // --- FIX 1: POPULATE STATE FROM PROP CORRECTLY ---
  // When modal opens, or userProgram loads, update the form state
  useEffect(() => {
    if (isOpen) {
        setFormData(prev => ({
            ...prev,
            // If userProgram exists, use it. Otherwise default to empty string.
            college_program: userProgram || '' 
        }));
    }
  }, [isOpen, userProgram]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isOpen]);

  const totalPrice = useMemo(() => {
    const certOptions = documentOptions.find(g => g.label.includes("Certifications"))?.options || [];

    return formData.request.reduce((total, item) => {
      const match = item.match(/\(P(\d+)/);
      
      if (match) {
        return total + parseInt(match[1], 10);
      } 
      else if (certOptions.includes(item)) {
        return total + 80;
      }

      return total;
    }, 0);
  }, [formData.request]);

  const isPurposeRequired = useMemo(() => {
    if (formData.request.length === 0) return false;
    return formData.request.some(doc => !exemptDocuments.includes(doc));
  }, [formData.request]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'is_graduate') {
        updated.affiliation = checked ? 'Alumni' : 'Student';
        if (!checked) updated.last_attended = '';
      }
      return updated;
    });
  };

  const handleDocumentToggle = (docName) => {
    if (restrictedDocuments.includes(docName)) {
        setSelectedRestrictedDoc(docName);
        setIsRequirementsModalOpen(true);
        setIsDropdownOpen(false);
        return;
    }

    setFormData((prev) => {
      const currentRequests = prev.request;
      let newRequests;
      
      if (currentRequests.includes(docName)) {
        newRequests = currentRequests.filter((item) => item !== docName);
      } else {
        newRequests = [...currentRequests, docName];
      }
      return { ...prev, request: newRequests };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClearanceImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

     if (!formData.clearance_status) {
        toast.error("You must be cleared to submit a request.");
        setLoading(false);
        return;
    }

    if (formData.request.length === 0) {
        toast.error("Please select at least one document.");
        setLoading(false);
        return;
    }

    if (!formData.college_program || !formData.college_program.trim()) {
        toast.error("Please specify your Program/Course.");
        setLoading(false);
        return;
    }

    if (isPurposeRequired && !formData.request_purpose.trim()) {
        toast.error("Please provide a purpose for your request.");
        setLoading(false);
        return;
    }


    const dataToSend = new FormData();

    let cleanedRequests = formData.request.map(item => {
        if (item === "Others") return "Others"; 
        return item.replace(/\s*\(P.*?\)/g, "").trim(); 
    });
    
    if (cleanedRequests.includes("Others") && formData.custom_request) {
        cleanedRequests = cleanedRequests.filter(item => item !== "Others"); 
        cleanedRequests.push(formData.custom_request); 
    } else {
        cleanedRequests = cleanedRequests.filter(item => item !== "Others");
    }

    dataToSend.append("request", cleanedRequests.join(", "));
    dataToSend.append("cost", totalPrice.toFixed(2));
    dataToSend.append("year_level", formData.year_level);
    
    // Ensure we send the value from the form data (which might be edited by user)
    dataToSend.append("college_program", formData.college_program);
    
    dataToSend.append("affiliation", formData.affiliation);
    dataToSend.append("clearance_status", "true");
    dataToSend.append("is_graduate", formData.is_graduate ? "true" : "false");
    dataToSend.append("request_purpose", formData.request_purpose);

    if (formData.is_graduate) {
      dataToSend.append("last_attended", formData.last_attended);
    } else {
      dataToSend.append("last_attended", "");
    }

    if (clearanceImage) {
      dataToSend.append("eclearance_proof", clearanceImage);
    }

    try {
      await axiosInstance.post("/requests/create/", dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setFormData({
        request: [],
        custom_request: "",
        year_level: "1st Year",
        college_program: userProgram || "", // Reset to default on success
        is_graduate: false,
        last_attended: "",
        clearance_status: false,
        affiliation: "Student",
        request_purpose: "",
      });
      setClearanceImage(null);
      setPreviewUrl(null);

      onSuccess();
      onClose();
      toast.success("Request submitted successfully!");
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedLabel = () => {
    if (formData.request.length === 0) return "Select Documents...";
    if (formData.request.length === 1) return formData.request[0];
    return `${formData.request.length} documents selected`;
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">

        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-[#1a1f63]">New Request</h2>
            <p className="text-xs text-gray-500">Fill in the details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Document Dropdown */}
            <div className="space-y-1 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-gray-700">Document Type</label>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${
                    isDropdownOpen ? 'border-[#1a1f63] ring-2 ring-[#1a1f63]/20' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`truncate ${formData.request.length > 0 ? "text-black font-medium" : "text-gray-400"}`}>
                    {getSelectedLabel()}
                </span>
                <div className="text-gray-500">
                    {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto no-scrollbar p-1">
                    {documentOptions.map((group, idx) => (
                    <div key={idx} className="mb-2">
                        <div className={`sticky top-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider z-10 ${
                            group.label.includes("Walk-in") 
                                ? "bg-orange-50 text-orange-600" 
                                : "bg-gray-100 text-gray-500"
                        }`}>
                            {group.label}
                        </div>
                        <div className="space-y-0.5 p-1">
                        {group.options.map((option, optIdx) => {
                            const isSelected = formData.request.includes(option);
                            const isRestricted = restrictedDocuments.includes(option);

                            return (
                            <div 
                                key={optIdx}
                                onClick={() => handleDocumentToggle(option)}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                                    isSelected 
                                    ? 'bg-blue-50 text-[#1a1f63]' 
                                    : isRestricted 
                                        ? 'hover:bg-orange-50 text-gray-600' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex-shrink-0 transition-colors ${isSelected ? 'text-[#1a1f63]' : 'text-gray-300'}`}>
                                        {isSelected 
                                            ? <CheckSquare size={18} /> 
                                            : isRestricted 
                                                ? <Info size={18} className="text-orange-400" /> 
                                                : <Square size={18} />
                                        }
                                    </div>
                                    <span className="text-sm font-medium select-none">
                                        {option}
                                    </span>
                                </div>
                                {isRestricted && (
                                    <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                                        Info
                                    </span>
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </div>

            {formData.request.includes("Others") && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-sm font-semibold text-gray-700">Specify Document (Others)</label>
                <input
                  type="text"
                  name="custom_request"
                  value={formData.custom_request}
                  onChange={handleChange}
                  placeholder="Please specify the document name"
                  required
                  className="w-full px-4 py-2.5 text-black bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1a1f63] outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Year Level */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Year Level</label>
                <select
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] text-black appearance-none cursor-pointer"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate Studies">Graduate Studies</option>
                  <option value="Senior High School">Senior High School</option>
                </select>
              </div>

              {/* --- FIX 2: CONTROLLED INPUT --- */}
              {/* Program Input */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Program / Course</label>
                <input
                  type="text"
                  name="college_program"
                  // Bind directly to formData state, NOT the prop.
                  // The prop was already loaded into formData by the useEffect.
                  value={formData.college_program}
                  onChange={handleChange}
                  placeholder="e.g. BS Information Technology"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] text-black"
                />
              </div>

              {formData.is_graduate && (
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Last S.Y. Attended</label>
                  <input
                    type="text"
                    name="last_attended"
                    value={formData.last_attended}
                    onChange={handleChange}
                    placeholder="e.g. 2022-2023"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] text-black"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_graduate"
                  checked={formData.is_graduate}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-[#1a1f63] focus:ring-[#1a1f63]"
                />
                <span className="text-sm font-medium text-gray-700">I am an Alumni</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="clearance_status"
                  checked={formData.clearance_status}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-[#1a1f63] focus:ring-[#1a1f63]"
                />
                <span className="text-sm font-medium text-gray-700">I am Cleared</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Clearance Proof</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-32 object-contain rounded-lg" />
                    <p className="text-xs text-gray-500 mt-2">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 bg-indigo-50 text-[#1a1f63] rounded-full group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-2">Click to upload clearance</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Purpose of Request
                {isPurposeRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                name="request_purpose"
                value={formData.request_purpose}
                onChange={handleChange}
                rows="3"
                placeholder={isPurposeRequired ? "Required for selected document(s)..." : "Optional"}
                className={`w-full text-black px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-[#1a1f63] outline-none resize-none ${
                    isPurposeRequired && !formData.request_purpose ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>

            {/* PRICE DISPLAY */}
            <div className="flex justify-between items-center px-2">
                <span className="text-sm font-semibold text-gray-500">Total Estimated Fee:</span>
                <span className="text-lg font-bold text-[#1a1f63]">
                    {totalPrice > 0 ? `₱${totalPrice}` : '₱0'}
                </span>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.clearance_status}
              className={`w-full font-bold py-3.5 rounded-xl transition shadow-lg ${
                !formData.clearance_status 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1a1f63] text-white hover:bg-indigo-900 shadow-indigo-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : !formData.clearance_status ? (
                "Please confirm clearance first"
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>

    <RequirementsModal 
        isOpen={isRequirementsModalOpen} 
        onClose={() => setIsRequirementsModalOpen(false)}
        documentName={selectedRestrictedDoc}
    />
    </>
  );
};

export default RequestDocumentModal;