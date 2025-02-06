import react from "react";
import '../assests/css/Loader.css';
import {Card} from "reactstrap";
const Loader = ({ numberOfLoadersToDisplay = 1 }) => {
    const loaders = [];
    for (let i = 0; i < numberOfLoadersToDisplay; i++) {
        loaders.push(
            <div key={i} className="skeleton-loader">
                <div className="skeleton-image"></div>
                <input type="text" className="skeleton-input"/>
                <p className="skeleton-text"></p>
                <button className="skeleton-btn"></button>
            </div>
        );
    }

    return (
        <Card className="loader">
            {loaders}
        </Card>
    );
};

export default Loader;