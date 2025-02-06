import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Input } from "reactstrap";
import "../../assests/css/Home.css";
import { homeContent, } from "../../api-services/home";
import Comment from "../comment/Comment";
import Voting from "../voting/Voting";
import { summaryVotes } from "../../api-services/votes/votes";

const Home = () => {
    const [showInput, setShowInput] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [voteSummary, setVoteSummary] = useState({ labels: [], count: [] });

    useEffect(() => {
        const interval = setInterval(async () => {
            const summary = await summaryVotes();
            const labels = summary?.map(s => s.label) || [];
            const count = summary?.map(s => s.count) || [];
            setVoteSummary({ labels, count });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleComment = () => {
        setShowInput(true);
    };


    const handleButtonClick = () => {
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
            <div
                className="container-fluid"
                style={{
                    backgroundImage: `url(${homeContent.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '50px 0',
                }}
            >
                <Row>
                    <Col tag="div" className="text-home-titles">
                        <h1 className="text-center">{homeContent.title}</h1>
                        <p className="text-center">{homeContent.subtitle}</p>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs="12" md="8" lg="6" className="home-title">
                        <Card className="d-flex flex-column flex-sm-row" style={{ gap: '10px', background: 'transparent' }}>
                            <Button className="btn btn-outline-primary flex-grow-1" type="button" style={{ height: '50px', backgroundColor: "red", color: "white" }} onClick={handleButtonClick}>
                                {homeContent.buttonText}
                            </Button>
                            <Button className="btn btn-outline-primary flex-grow-1" type="button" style={{ height: '50px', backgroundColor: "red", color: "white" }} onClick={handleComment}>
                                {homeContent.commentButton}
                            </Button>
                        </Card>
                        {showInput && (
                            <div style={{ marginTop: '10px' }}>
                                <Comment
                                    replyToUsername={username}
                                />
                            </div>
                        )}
                    </Col>
                    <ul className="d-flex flex-column flex-sm-row justify-content-center" style={{ opacity: showDialog ? 0.4 : 1 }}>
                        {voteSummary.labels.map((label, index) => (
                            <React.Fragment key={index}>
                                <svg viewBox="0 0 100 20">
                                    <defs>
                                        <linearGradient id="gradient">
                                            <stop color="#000" />
                                        </linearGradient>
                                        <pattern id="wave" x="0" y="-0.5" width="100%" height="100%" patternUnits="userSpaceOnUse">
                                            <path id="wavePath" d="M-40 9 Q-30 7 -20 9 T0 9 T20 9 T40 9 T60 9 T80 9 T100 9 T120 9 V20 H-40z" mask="url(#mask)" fill="url(#gradient)">
                                                <animateTransform
                                                    attributeName="transform"
                                                    begin="0s"
                                                    dur="1.5s"
                                                    type="translate"
                                                    from="0,0"
                                                    to="40,0"
                                                    repeatCount="indefinite" />
                                            </path>
                                        </pattern>
                                    </defs>
                                    <text textAnchor="middle" x="50" y="15" fontSize="17" fill="white" fillOpacity="0.4">{label}: {voteSummary.count[index]}</text>
                                    <text textAnchor="middle" x="50" y="15" fontSize="17" fill="url(#wave)" fillOpacity="1">{label}: {voteSummary.count[index]}</text>
                                </svg>
                            </React.Fragment>
                        ))}
                    </ul>
                </Row>
            </div>
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <Voting/>
                        <Button onClick={closeDialog}>Close</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;