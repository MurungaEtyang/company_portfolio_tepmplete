import {FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaTwitter} from "react-icons/fa";
import backGroundImage from "../assets/img/innovative-futuristic-classroom-students.jpg"

export const contactInfo = {
    title: "Contact Us",
    map: {
        center: {
            lat: -1.051135,
            lng: 37.072558,
        },
        zoom: 15,
        options: {
            mapId: "d6c7a5f33d55cadc",
            tilt: 45,
        },
        apiKey: "",
    },
    body: {
        text: "If you have any questions or need support, please don't hesitate to contact us. We're located in the beautiful town of Thika, Kenya.",
        info: [
            {
                icon: FaEnvelope,
                text: "support@kbhcks.com",
            },
            {
                icon: FaPhone,
                text: "+254 712 345 678",
            },
            {
                icon: FaMapMarkerAlt,
                text: "KBHCKS Software HQ, Thika, Kenya",
            },

        ],
    },
    form: {
        fields: [
            {
                label: "Name",
                id: "name",
                type: "text",
            },
            {
                label: "Email address",
                id: "email",
                type: "email",
            },
            {
                label: "Message",
                id: "message",
                type: "textarea",
                rows: 3,
            },
        ],
        submit: "Submit",
    },

    bg: backGroundImage
};