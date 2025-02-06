import React, { useState } from "react";
import '../../assests/css/AdvertiseWithUs.css'
import NavBar from "../../components/NavBar";

const AdvertisingRequestForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        businessName: "",
        businessType: "",
        website: "",
        adType: "",
        targetAudience: "",
        adDuration: "",
        startDate: "",
        budget: "",
        additionalDetails: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        setSubmitted(true);
    };

    return (
        <div className="container advertise-container mx-auto p-4 max-w-xl">
            <section>
                <NavBar onClick={() => {
                }}/>
            </section>
            <div className="bg-yellow-500 text-white font-semibold rounded p-2 mb-4">
                <p>Coming soon...</p>
            </div>
            <h1 className="text-2xl font-bold mb-4">Advertising Request Form</h1>
            {submitted ? (
                <p className="text-green-600 font-semibold">
                    Thank you for your request! We will get back to you soon.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="phone">
                            Phone Number (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Business Name */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="businessName">
                            Business Name
                        </label>
                        <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                            placeholder="Enter your business name"
                        />
                    </div>

                    {/* Business Type */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="businessType">
                            Business Type/Industry
                        </label>
                        <input
                            type="text"
                            id="businessType"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., Retail, IT, Healthcare"
                        />
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="website">
                            Business Website or Social Media (Optional)
                        </label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Enter your website or social media link"
                        />
                    </div>

                    {/* Ad Type */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="adType">
                            Ad Type
                        </label>
                        <select
                            id="adType"
                            name="adType"
                            value={formData.adType}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select Ad Type</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Billboard">Billboard</option>
                            <option value="TV">TV</option>
                            <option value="Radio">Radio</option>
                        </select>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="targetAudience">
                            Target Audience
                        </label>
                        <textarea
                            id="targetAudience"
                            name="targetAudience"
                            value={formData.targetAudience}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Describe your target audience (age, location, interests, etc.)"
                        ></textarea>
                    </div>

                    {/* Ad Duration */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="adDuration">
                            Ad Duration
                        </label>
                        <input
                            type="text"
                            id="adDuration"
                            name="adDuration"
                            value={formData.adDuration}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="e.g., 1 week, 1 month"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1" htmlFor="startDate">
                            Preferred Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="budget">
                            Estimated Budget
                        </label>
                        <input
                            type="number"
                            id="budget"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                            placeholder="Enter your estimated budget"
                        />
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label
                            className="block font-semibold mb-1"
                            htmlFor="additionalDetails"
                        >
                            Additional Details (Optional)
                        </label>
                        <textarea
                            id="additionalDetails"
                            name="additionalDetails"
                            value={formData.additionalDetails}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            placeholder="Provide additional details or creative directions"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gray-500 text-white font-semibold rounded p-2 hover:bg-gray-700 cursor-not-allowed"
                        disabled
                    >
                        Submit Request
                    </button>
                </form>
            )}
        </div>
    );
};

export default AdvertisingRequestForm;