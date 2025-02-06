import react from "react";
import '../assests/css/Loader.css';
import {Card} from "reactstrap";
const ChatsLoader = ({ numberOfLoadersToDisplay = 1 }) => {
    const loaders = [];
    for (let i = 0; i < numberOfLoadersToDisplay; i++) {
        loaders.push(
            <div key={i} className="skeleton-loader">
                <p className="skeleton-text"></p>
            </div>
        );
    }

    return (
        <Card className="loader">
            {loaders}
        </Card>
    );
};

export default ChatsLoader;