import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import {FaCopy, FaQuestionCircle, FaThumbsDown, FaThumbsUp} from "react-icons/fa";
import { toast } from "react-toastify";
import {responseFromServer} from "../../api-services/voting";
import {placeVote} from "../../api-services/votes/placeVote";

const Voting = () => {
    const [vote, setVote] = useState(null);
    const [message, setMessage] = useState("");


    const hasVoted = localStorage.getItem("hasVoted");

    const handleVote = (voteOption) => {
        if (!hasVoted) {
            localStorage.setItem("hasVoted", "true");
            localStorage.setItem("vote", voteOption.charAt(0).toUpperCase() + voteOption.slice(1));
            setVote(voteOption.charAt(0).toUpperCase() + voteOption.slice(1));
            setMessage(`Vote successful! You voted: ${voteOption.charAt(0).toUpperCase() + voteOption.slice(1)}`);
            console.log(voteOption);
            placeVote(voteOption)
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Phone number copied to clipboard!");
    };

    return (
        <div className="voting-container text-center">

            {responseFromServer.votingOptions.map((option, index) => (
                <Button
                    key={index}
                    onClick={() => handleVote(option)}
                    color={option === "Yes" ? "success" : option === "No" ? "danger" : "warning"}
                    style={{ marginRight: "10px" }}
                    disabled={hasVoted}
                >
                    {option === "yes" ? <FaThumbsUp /> : option === "no" ? <FaThumbsDown /> : <FaQuestionCircle />}
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
            ))}

            <Alert color={hasVoted ? "danger" : "info"}>
                {hasVoted
                    ? (
                        <div style={{ fontWeight: 'bold' }}>
                            <p style={{ color: '#ff0000' }}>🚨 You've already voted! 🚨 {vote}</p>
                            <p className={`dialogue-message`}>
                                {responseFromServer.donationInfo.message}
                            </p>
                            
                            <div>
                                <span>Airtel Money: {responseFromServer.donationInfo.airtelNumber}</span>
                                <FaCopy
                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                    onClick={() => copyToClipboard(responseFromServer.donationInfo.airtelNumber)}
                                />
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <span>M-Pesa: {responseFromServer.donationInfo.mpesaNumber}</span>
                                <FaCopy
                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                    onClick={() => copyToClipboard(responseFromServer.donationInfo.mpesaNumber)}
                                />
                            </div>
                        </div>
                    )
                    : "Cast your vote thoughtfully."
                }
            </Alert>
        </div>
    );
};

export default Voting;
