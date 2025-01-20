import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../assets/css/AboutUs.css";
import { data } from "../../api-services/about-us";
import FadeInSection from "../../components/FadeInSection";

const AboutUs = () => {
    return (
        <FadeInSection className="about-us-container">
            <Container className="about-us-container">
                <Col><h1 className="about-us-title">{data.title}</h1></Col>
                <Row className="about-us-body d-flex justify-content-end">
                    <Col xs="12" md="6" className="about-us-image">
                        <img src={data.image} alt={data.title} className="img-fluid" />
                    </Col>
                    {/*<FadeInSection>*/}
                        <Col xs="12" md="6" className="about-us-content">
                            <p className="about-us-text">{data.text}</p>
                        </Col>
                    {/*</FadeInSection>*/}
                </Row>
                <FadeInSection>
                    <Row className="about-us-stats">
                        {data.stats.map((stat, index) => (
                            <Col xs="12" md="4" className="d-flex justify-content-center" key={index}>
                                <h1 className="about-us-stat">{stat.value}</h1>
                                <p className="about-us-stat-text">{stat.label}</p>
                            </Col>
                        ))}
                    </Row>
                </FadeInSection>
            </Container>
        </FadeInSection>
    );
};

export default AboutUs;