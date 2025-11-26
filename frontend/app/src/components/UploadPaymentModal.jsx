import React, { useState, useEffect } from 'react';
import { X, UploadCloud, CreditCard } from 'lucide-react';
import axiosInstance from '../utils/axios';

const UploadPaymentModal = ({ isOpen, onClose, request, onSuccess }) => {
  const [paymentImage, setPaymentImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens/closes or request changes
  useEffect(() => {
    if (isOpen) {
      setPaymentImage(null);
      setPreviewUrl(null);
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPaymentImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentImage) {
      alert("Please upload a payment receipt.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("payment_proof", paymentImage);

    try {
      await axiosInstance.patch(`/requests/${request.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("Payment proof uploaded successfully!");
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload payment proof.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-bold text-[#1a1f63]">
            {request.payment_proof_url ? "Update Payment" : "Upload Payment"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cost Display */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Amount Due</p>
              <p className="text-2xl font-bold text-[#1a1f63]">₱{request.cost || '0.00'}</p>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
              <CreditCard size={24} />
            </div>
          </div>

          {/* NEW: Show Existing Receipt if available */}
          {request.payment_proof_url && !previewUrl && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-2 font-semibold">Current Receipt:</p>
                <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden group">
                    <img 
                        src={request.payment_proof_url} 
                        alt="Current Receipt" 
                        className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                        onClick={() => window.open(request.payment_proof_url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-center">Click image to view full size</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                {request.payment_proof_url ? "Upload New Receipt" : "Payment Receipt"}
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-contain rounded-lg" />
                    <p className="text-xs text-gray-500 mt-2">Click to change image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-3 bg-indigo-50 text-[#1a1f63] rounded-full group-hover:scale-110 transition-transform">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-2">Click to upload receipt</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !paymentImage}
              className="w-full bg-[#1a1f63] text-white font-bold py-3 rounded-xl hover:bg-indigo-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {loading ? "Uploading..." : "Submit Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPaymentModal;