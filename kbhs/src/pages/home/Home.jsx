import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../../assets/css/Home.css";
import { homeContent } from "../../api-services/home";
import FadeInSection from "../../components/FadeInSection";

const Home = () => {
    return (
        <FadeInSection className="home-container">
            <Container
                tag="div"
                className="container-fluid"
                style={{
                    backgroundImage: `url(${homeContent.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '50px 0',
                    zIndex: '-9999'
                }}
            >
                <FadeInSection>
                    <Col tag={`div`} className={`text-home-titles`} >
                        <b><h1 className="text-center">{homeContent.title}</h1></b>
                        <p className="text-center">{homeContent.subtitle}</p>
                    </Col>
                    <Row className="justify-content-center">
                        <Col xs="12" md="8" lg="6" className="home-title">
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder={homeContent.placeholder}
                                    style={{height: '50px'}}
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-primary" type="button" style={{height: '50px'}}>
                                        {homeContent.buttonText}
                                    </button>
                                </div>
                            </div>


                        </Col>
                        <ul className="d-flex flex-column flex-sm-row  home-text-center">
                            {homeContent.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </Row>
                </FadeInSection>
            </Container>
        </FadeInSection>
    );
};

export default Home;