import { Carousel } from 'react-bootstrap';

const carouselItems = [
    {
        backgroundImage: "url('https://i.giphy.com/HCx3syuZkqLsI.webp')",
        title: "Click here to advertise with us"
    },
    {
        backgroundImage: "url('https://i.giphy.com/HCx3syuZkqLsI.webp')",
        title: "Advertise with us"
    },
    {
        backgroundImage: "url('https://i.giphy.com/sbNsbON60uSCBv3jm5.webp')",
        title: "Reach Your Target Audience"
    },
    {
        backgroundImage: "url('https://i.giphy.com/cXZEkXAWO5vQuhimpl.webp')",
        title: "Grow Your Business"
    }
];

const AdvertiseWithUs = () => {
    const handleClick = () => {
        window.location.href = "/advertise-with-us";
    };

    return (
        <>
            {/*<Carousel indicators={false} controls={false} onClick={handleClick}>*/}
            {/*    {carouselItems.map((item, index) => (*/}
            {/*        <Carousel.Item key={index} style={{ backgroundImage: item.backgroundImage }}>*/}
            {/*            <h1 style={{ color: "red", fontSize: "50px", textAlign: "center", margin: "0" }}>{item.title}</h1>*/}
            {/*        </Carousel.Item>*/}
            {/*    ))}*/}
            {/*</Carousel>*/}
        </>
    )
}

export default AdvertiseWithUs;