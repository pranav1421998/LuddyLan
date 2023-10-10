import React from "react";
import './GridCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark  } from '@fortawesome/free-solid-svg-icons';

const GridCards = () => {
    return (
        <div className="grid-cards">
            {/* Your grid cards content goes here */}
            <div className="card">
                <div className="profile-picture">
                </div>
                <p>Veda Charitha</p>
                <div>
                <a>
                    <FontAwesomeIcon icon={faCircleCheck} style ={{color: 'green'}}/>
                </a>
                <FontAwesomeIcon icon={faCircleXmark} />
                </div>
            </div>
            <div className="card">Card 2</div>
            <div className="card">Card 3</div>
            <div className="card">Card 3</div>
            <div className="card">Card 3</div>
            <div className="card">Card 3</div>
            <div className="card">Card 3</div>
            <div className="card">Card 3</div>

            {/* Add more cards as needed */}
        </div>
    );
};

export default GridCards;
