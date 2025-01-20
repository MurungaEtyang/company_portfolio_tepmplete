import React from "react";
import { Col, Row } from "reactstrap";
import "../../assets/css/Technologies.css";
import {technologies} from "../../api-services/technologies";
import FadeInSection from "../../components/FadeInSection";


const Technologies = () => {
    return (
        <FadeInSection>
            <div className="container technologies-container">
                <FadeInSection>
                    <h1 className="text-center mb-4">{technologies.explanation[0].title}</h1>
                    <p className="text-center">{technologies.explanation[0].paragraph}</p>
                </FadeInSection>
                <FadeInSection>
                    <Row
                        className="technologies-row flex-column flex-md-row gap-4 gap-md-5 technologies-container-items">
                        {technologies.items.map((tech, index) => (
                            <Col xs="12" md="3" className="d-flex justify-content-center" key={index}>
                                {tech.image ? (
                                    <div
                                        className="technologies-item"
                                        style={{
                                            backgroundImage: `url(${tech.image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        <h3>{tech.title}</h3>
                                        <p>{tech.paragraph}</p>
                                    </div>
                                ) : (
                                    <div className="technologies-item">
                                        <h3 className="text-center mb-4">{tech.title}</h3>
                                        <p className="text-center">{tech.paragraph}</p>
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>
                </FadeInSection>
            </div>
        </FadeInSection>

    );
};

export default Technologies;