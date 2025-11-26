import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import axiosInstance from '../utils/axios';

const RequestDocumentModal = ({ isOpen, onClose, onSuccess}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    request: '',
    year_level: '1st Year',
    is_graduate: false,
    last_attended: '',
    clearance_status: false,
    affiliation: 'Student',
    request_purpose: ''
  });

  const [clearanceImage, setClearanceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'is_graduate') {
        updated.affiliation = checked ? 'Alumni' : 'Student';
        if (!checked) updated.last_attended = '';
      }

      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClearanceImage(file);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    if (clearanceImage) {
      dataToSend.append("eclearance_proof", clearanceImage);
    }

    try {
      await axiosInstance.post("/requests/create/", dataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset values
      setFormData({
        request: '',
        year_level: '1st Year',
        is_graduate: false,
        last_attended: '',
        clearance_status: false,
        affiliation: 'Student',
        request_purpose: ''
      });

      setClearanceImage(null);
      setPreviewUrl(null);

      onSuccess();
      onClose();
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error adding request:", error);
      alert("Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-[#1a1f63]">New Request</h2>
            <p className="text-xs text-gray-500">Fill in the details below.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Request */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-g-700">Document Name</label>
              <input
                type="text"
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="e.g. Transcript of Records"
                required
                className="w-full px-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Year Level / Last Attended */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Year Level</label>
                <select
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] text-black"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Graduate Studies">Graduate Studies</option>
                </select>
              </div>

                            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Course</label>
                <input
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] text-black"
                >

                </input>
              </div>

              {formData.is_graduate && (
                <div className="space-y-1">
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

            {/* Checkboxes */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_graduate"
                  checked={formData.is_graduate}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium text-gray-700">I am an Alumni</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="clearance_status"
                  checked={formData.clearance_status}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium text-gray-700">I am Cleared</span>
              </label>
            </div>

            {/* File Upload */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Clearance Proof</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <div className="p-3 bg-indigo-50 text-[#1a1f63] rounded-full inline-block">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-2">Click to upload</p>
                  </>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Purpose</label>
              <textarea
                name="request_purpose"
                value={formData.request_purpose}
                onChange={handleChange}
                rows="2"
                className="w-full text-black px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1f63] outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1f63] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-900 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestDocumentModal;
