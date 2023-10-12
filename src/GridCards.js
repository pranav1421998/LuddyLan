import React from "react";
import './GridCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const GridCards = ({ data }) => {
    return (
        <div className="grid-cards">
            {data.map((item, index) => (
                <div className="card" key={index}>
                    <div className="profile-picture">
                    </div>
                    <p>{item.name}</p>
                    <div>
                        <a>
                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '24px' }} />
                            {/* Adjust the font-size as needed (e.g., '24px') */}
                        </a>
                        <span className="icon-gap"></span>
                        <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '24px' }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridCards;
