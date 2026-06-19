import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, Smartphone, Sparkles } from "lucide-react";

interface EnquiryFormProps {
  onSuccessSubmit?: (enquiry: any) => void;
  selectedDefaultType?: string;
}

export default function EnquiryForm({ onSuccessSubmit, selectedDefaultType = "" }: EnquiryFormProps) {
  // Form fields state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    shoeType: "Casual Shoes",
    brand: "",
    size: "",
    message: "",
  });

  // Submission process state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sync default values when category selected
  useEffect(() => {
    if (selectedDefaultType) {
      setFormData((prev) => ({ ...prev, shoeType: selectedDefaultType }));
    }
  }, [selectedDefaultType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error if typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Customer name is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.shoeType) errors.shoeType = "Please select a shoe category";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
      };

      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (response.ok) {
        setStatusMsg({
          type: "success",
          text: `Thank you, ${formData.name}! Your enquiry for ${formData.shoeType} has been secured. Anil Mehta will contact you shortly.`,
        });
        
        // Zero out form details but preserve shoeType
        setFormData({
          name: "",
          phone: "",
          shoeType: formData.shoeType,
          brand: "",
          size: "",
          message: "",
        });

        if (onSuccessSubmit) {
          onSuccessSubmit(resData.enquiry);
        }
      } else {
        setStatusMsg({
          type: "error",
          text: resData.error || "Oops! Something went wrong committing your enquiry.",
        });
      }
    } catch (error: any) {
      setStatusMsg({
        type: "error",
        text: `Network failure: ${error.message || "Could not reach the server. Please try again."}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#111111] border border-white/10 p-6 md:p-10 shadow-2xl transition-all duration-300 hover:border-[#ff6b00]/30">
      
      {/* Decorative Gold Light Stream */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#ff6b00] to-transparent" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2 italic uppercase">
            <Sparkles className="w-5 h-5 text-[#ff6b00]" />
            Quick Enquiry Desk
          </h3>
          <p className="text-gray-400 text-xs mt-1 font-light">
            Send an instant request. Perfect fit sizes & direct pricing answers.
          </p>
        </div>
      </div>

      {/* Primary enquiry intake form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer Name */}
          <div>
            <label htmlFor="enquiry-name" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
              Your Full Name <span className="text-[#ff6b00]">*</span>
            </label>
            <input
              id="enquiry-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Anil Mehta"
              className={`w-full bg-black border text-sm text-white rounded-sm px-4 py-3 placeholder:text-gray-700 focus:outline-none transition-all ${
                validationErrors.name ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-gold focus:shadow-[0_0_15px_rgba(255,107,0,0.2)]"
              }`}
            />
            {validationErrors.name && (
              <p className="text-xxs text-rose-400 mt-1 font-mono transition-transform duration-200">{validationErrors.name}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label htmlFor="enquiry-phone" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
              WhatsApp or Phone Contact <span className="text-[#ff6b00]">*</span>
            </label>
            <div className="relative">
              <input
                id="enquiry-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 78766 24340"
                className={`w-full bg-black border text-sm text-white rounded-sm pl-10 pr-4 py-3 placeholder:text-gray-700 focus:outline-none transition-all ${
                  validationErrors.phone ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-gold focus:shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                }`}
              />
              <span className="absolute left-3.5 top-3.5 text-gray-500">
                <Smartphone className="w-4 h-4" />
              </span>
            </div>
            {validationErrors.phone && (
              <p className="text-xxs text-rose-400 mt-1 font-mono">{validationErrors.phone}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Shoe Type selection */}
          <div>
            <label htmlFor="enquiry-shoeType" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
              Footwear Category <span className="text-[#ff6b00]">*</span>
            </label>
            <select
              id="enquiry-shoeType"
              name="shoeType"
              value={formData.shoeType}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 text-sm text-white rounded-sm px-3.5 py-3 focus:outline-none focus:border-gold appearance-none cursor-pointer"
            >
              <option value="Casual Shoes">Casual Shoes</option>
              <option value="Formal Shoes">Formal Shoes</option>
              <option value="Sports Shoes">Sports Shoes</option>
              <option value="Sneakers">Sneakers</option>
              <option value="Boots">Boots</option>
              <option value="Slippers/Sleepers">Slippers / Sliders</option>
              <option value="Ladies Footwear">Ladies Footwear</option>
              <option value="Kids Footwear">Kids Footwear</option>
            </select>
          </div>

          {/* Requested Brand */}
          <div>
            <label htmlFor="enquiry-brand" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
              Preferred Brand (Optional)
            </label>
            <select
              id="enquiry-brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 text-sm text-white rounded-sm px-3.5 py-3 focus:outline-none focus:border-gold appearance-none cursor-pointer"
            >
              <option value="">Choose Brand</option>
              <option value="Red Tape">Red Tape</option>
              <option value="Sparx">Sparx</option>
              <option value="Campus">Campus</option>
              <option value="Relaxo">Relaxo</option>
              <option value="Action">Action</option>
              <option value="Goldstar">Goldstar</option>
              <option value="Bata">Bata</option>
              <option value="Abros">Abros</option>
              <option value="Lakhani">Lakhani</option>
              <option value="Nike">Nike</option>
              <option value="Puma">Puma</option>
              <option value="Adidas">Adidas</option>
              <option value="Other">Other / Local brand</option>
            </select>
          </div>

          {/* Requested Size */}
          <div>
            <label htmlFor="enquiry-size" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
              Estimate Shoe Size (Optional)
            </label>
            <select
              id="enquiry-size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full bg-black border border-white/10 text-sm text-white rounded-sm px-3.5 py-3 focus:outline-none focus:border-gold appearance-none cursor-pointer"
            >
              <option value="">Choose India Size</option>
              <option value="India 5">India 5 (EU 38)</option>
              <option value="India 6">India 6 (EU 39)</option>
              <option value="India 7">India 7 (EU 41)</option>
              <option value="India 8">India 8 (EU 42)</option>
              <option value="India 9">India 9 (EU 43)</option>
              <option value="India 10">India 10 (EU 44)</option>
              <option value="India 11">India 11 (EU 45)</option>
              <option value="Kids (Specify in note)">Kids sizing (custom)</option>
            </select>
          </div>
        </div>

        {/* Message box */}
        <div>
          <label htmlFor="enquiry-message" className="block text-xs font-bold text-gray-400 mb-1.5 uppercase font-mono tracking-wider">
            Special Specifications or Messages
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="e.g., Looking for black/tan variant. Do you have a bag offer on this model?"
            className="w-full bg-black border border-white/10 text-sm text-white rounded-sm px-4 py-3 placeholder:text-gray-700 focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {/* Submit action */}
        <div className="flex gap-4 items-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-9 py-4 bg-[#ff6b00] text-white font-extrabold uppercase tracking-widest text-xs md:text-sm rounded-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] disabled:opacity-55 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Securing Record...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Enquiry
              </>
            )}
          </button>

          <span className="hidden md:inline text-xs text-gray-505 font-mono">
            🛡 Secure SSL Connection
          </span>
        </div>

        {/* Response messaging */}
        {statusMsg.text && (
          <div
            className={`mt-6 p-4 rounded-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center animate-fadeIn ${
              statusMsg.type === "success" 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
            }`}
          >
            <div className="flex gap-2.5 items-start">
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-rose-500 text-rose-500 flex items-center justify-center font-bold text-xs shrink-0 select-none">!</div>
              )}
              <span className="text-xs md:text-sm font-light">{statusMsg.text}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
