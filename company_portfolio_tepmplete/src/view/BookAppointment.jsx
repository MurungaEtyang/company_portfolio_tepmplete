import React, { useState, useEffect } from "react";
import { bookApplication, getAppointments } from "../services/projects/bookApplication";

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        purpose: "",
        mpsName: "",
        appointmentDate: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [view, setView] = useState("book"); // "book" or "booked"
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const recipients = ["Member of parliament", "Governor"];

    useEffect(() => {
        if (view === "booked") {
            fetchAppointments();
        }
    }, [view]);

    const fetchAppointments = async () => {
        setLoading(true);
        const data = await getAppointments();
        console.log("Fetched Appointments:", data);
        setAppointments(data.data || []);
        setStatus(data.status);
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { message } = await bookApplication(formData.appointmentDate, formData.mpsName, formData.purpose);
        setStatus(message);
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <nav className="mb-4">
                <button
                    className={`px-4 py-2 mx-2 rounded ${view === "book" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                    onClick={() => setView("book")}
                >
                    Book Application
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded ${view === "booked" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                    onClick={() => setView("booked")}
                >
                    Booked Appointments
                </button>
            </nav>

            {view === "book" ? (
                <div className="bg-green-300 text-black p-6 rounded-lg shadow-lg md:w-1/2">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Book an Appointment</h2>
                    {submitted ? (
                        <div className="text-green-600 text-lg">
                            ✅ Appointment booked with <strong>{formData.mpsName}</strong> on {" "}
                            <strong>{formData.appointmentDate}</strong> regarding: <strong>{formData.purpose}</strong>.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-semibold">Purpose:</label>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Provide details..."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">To:</label>
                                <select
                                    name="mpsName"
                                    value={formData.mpsName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Select recipient</option>
                                    {recipients.map((person, index) => (
                                        <option key={index} value={person}>{person}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold">Date:</label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700" disabled={loading}>
                                {loading ? "Loading..." : "Book Appointment"}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="bg-green-300 text-black p-6 rounded-lg shadow-lg w-full md:w-1/2">
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">Booked Appointments</h2>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <ul className="mt-4">
                            {appointments.length > 0 ? (
                                appointments.map((appointment, index) => (
                                    <li key={index} className="py-2 border-b">
                                        <strong>{appointment.mps_name}</strong> on {" "}
                                        <strong>{new Date(appointment.appointment_date).toLocaleDateString()}</strong>
                                        <p>regarding: <strong>{appointment.purpose}</strong>.</p>
                                        <p>Status: <strong>{appointment.status}</strong></p>
                                    </li>
                                ))
                            ) : (
                                <p>No Appointments found. {status}</p>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookAppointment;