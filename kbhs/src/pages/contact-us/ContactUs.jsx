import React from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../../assets/css/ContactUs.css";
import { contactInfo } from "../../api-services/contact-us";
import FadeInSection from "../../components/FadeInSection";

const ContactUs = () => {

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '10px',
        marginTop: '20px'
    };

    return (
        <FadeInSection>
            <Container className={`container contact-us-container`} style={{ backgroundImage: `url(${contactInfo.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <FadeInSection><CardTitle tag="h5" className={`contact-us-title`}>{contactInfo.title}</CardTitle></FadeInSection>
                <Row className={`map`}>
                    <FadeInSection>
                        <Col>
                            <LoadScript googleMapsApiKey={contactInfo.map.apiKey}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={contactInfo.map.center}
                                    zoom={contactInfo.map.zoom}
                                    options={contactInfo.map.options}
                                >
                                    <Marker position={contactInfo.map.center} />
                                </GoogleMap>
                            </LoadScript>
                        </Col>
                    </FadeInSection>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardBody className={`contact-us-body`}>
                                <FadeInSection>
                                    <CardText className={`contact-us-card-text`}>
                                        {contactInfo.body.text}
                                    </CardText>
                                </FadeInSection>
                                <Col className={`contact-us-info-cont`}>
                                    <Col md={6}>
                                        <FadeInSection>
                                            <CardText tag="div" className="d-block text-center contact-us-info" style={{ margin: "20px 0" }}>
                                                {contactInfo.body.info.map(({ icon: Icon, text }) => (
                                                    <p key={text}><Icon className="me-2" /> {text}</p>
                                                ))}
                                            </CardText>
                                        </FadeInSection>
                                    </Col>
                                    <Col md={6}>
                                        <FadeInSection>
                                            <form className={`contact-us-form`}>
                                                {contactInfo.form.fields.map(({label, id, type, rows}) => (
                                                    <div key={id} className="mb-3">
                                                        <label htmlFor={id} className="form-label">{label}</label>
                                                        {type === "textarea" ? (
                                                            <textarea className="form-control" id={id} rows={rows}/>
                                                        ) : (
                                                            <input type={type} className="form-control" id={id}
                                                                   aria-describedby={`${id}Help`}/>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="submit"
                                                        className="btn btn-primary">{contactInfo.form.submit}</button>
                                            </form>
                                        </FadeInSection>
                                    </Col>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </FadeInSection>
    );
};

export default ContactUs;