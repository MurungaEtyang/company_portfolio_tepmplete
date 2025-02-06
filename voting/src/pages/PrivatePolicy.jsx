import React from 'react';
import "../assests/css/PrivatePolicy.css";
import {privacyPolicyData} from "../api-services/privatePolicy";
import NavBar from "../components/NavBar";



const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-container">
            <section>
                <NavBar onClick={() => {
                }}/>
            </section>
            <h1>{privacyPolicyData.title}</h1>
            {Object.keys(privacyPolicyData).map((key, index) => {
                const section = privacyPolicyData[key];
                return (
                    <div key={index}>
                        <h2>{section.heading}</h2>
                        <p>{section.text}</p>
                        {section.list && (
                            <ul>
                                {section.list.map((item, index) => (
                                    <li key={index}>
                                        <h3>{item.heading}</h3>
                                        <p>{item.text}</p>
                                        {item.sublist && (
                                            <ul>
                                                {item.sublist.map((subitem, index) => (
                                                    <li key={index}>{subitem}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PrivacyPolicy;