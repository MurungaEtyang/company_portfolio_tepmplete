import React, {useEffect, useState} from "react";
import {Container, Row, Col, Card, CardBody, CardTitle, CardText, Button} from "reactstrap";
import "./Initiatives.css";
import {initialData} from "../../api-services/initiatives";
import FadeInSection from "../../components/FadeInSection";


const Section = ({ title, data, type }) => {
    return (
        <FadeInSection>
            <div className="initiatives-section">
                <Col xs={12} md={12}>
                    <CardText className="initiatives-section-title">{title}</CardText>
                </Col>
                <div className={`initiatives-${type}`} style={{ overflow: "hidden" }}>
                    <div style={{ display: "flex", gap: "20px", animation: "slide 30s linear infinite" }}>
                        {data.map((item, index) => (
                            <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2}
                                 style={{ display: "flex", flexDirection: "column", minWidth: "200px" }}>
                                <Card style={{
                                    backgroundImage: `url(${item.image || item.logo})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '200px',
                                    borderRadius: '10px',
                                    '@media (max-width: 768px)': {
                                        height: '100px',
                                        width: '100px'

                                    }
                                }}>
                                    <a href={item.link || "#"} rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <CardBody>
                                            <CardTitle tag="h5">{item.name}</CardTitle>
                                            <CardText>{item.description || ""}</CardText>
                                        </CardBody>
                                    </a>
                                </Card>
                            </Col>
                        ))}
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes slide {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-100% - 20px)); }
                    }
                `}
            </style>
        </FadeInSection>
    );
};
const Initiatives = () => {
    const [initiativesData, setInitiativesData] = useState(initialData);
    const [currentDisplay, setCurrentDisplay] = useState(initiativesData.displayButtons[0].id);

    const handleClick = (id) => {
        setCurrentDisplay(id);
    };

    return (
        <FadeInSection className={'initiatives-container'}>
            <Container className="initiatives-container" style={{
                backgroundImage: `url(${initialData.background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <FadeInSection>
                    <Row className="initiatives-header d-flex justify-content-center">
                        <Col xs={12} md="auto">
                            <div className="initiatives-header-buttons d-flex flex-direction-row justify-content-center">
                                {initiativesData.displayButtons.map((button, index) => (
                                    <Button
                                        key={index}
                                        color="link"
                                        style={{
                                            textDecoration: currentDisplay === button.id ? "underline white" : "none",
                                        }}
                                        onClick={() => handleClick(button.id)}
                                    >
                                        {button.name}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </FadeInSection>

                {initiativesData.displayButtons.map((button, index) => {
                    if (currentDisplay === button.id) {
                        return (
                            <Section
                                key={index}
                                title={initiativesData.titles[button.id]}
                                data={initiativesData[button.id]}
                                type={button.id}
                            />
                        );
                    }
                    return null;
                })}
            </Container>
        </FadeInSection>
    );
};

export default Initiatives;