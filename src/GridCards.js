import React from "react";
import './GridCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const GridCards = ({ name, profilePicture }) => {
    return (
        <div className="grid-cards">
            <div className="card">
                <div className="profile-picture">
                    <img src={profilePicture} alt={name} />
                </div>
                <p>{name}</p>
                <div>
                    <a>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '24px' }} />
                        {/* Adjust the font-size as needed (e.g., '24px') */}
                    </a>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: '24px' }} />
                </div>
            </div>
            {/* Add more cards as needed */}
        </div>
    );
};

export default GridCards;
