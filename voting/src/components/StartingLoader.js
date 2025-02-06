import react from "react";
import "../assests/css/Loader.css";
import {Container} from "reactstrap";

const StartingLoader = () => {

    return (
        <Container className="atom">
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
        </Container>

    )
}

export default StartingLoader;



