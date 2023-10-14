import React from "react";
import './GridCards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSolid, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const GridCards = ({ data }) => {
    const getIcons = (item) => {
        switch (item.condition) {
            case 'AllUsers':
                console.log(item,'********************');
                if(item.is_accepted === true) {
                    return (
                        <><button className= "connect-button" style={{backgroundColor: '#9b0303'}}> <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: '24px' }} />Connected</button></>)
                } else {
                    return (
                        <><button className= "connect-button" style={{backgroundColor: '#9b0303'}}> <FontAwesomeIcon icon={faPlusCircle} style={{ fontSize: '24px' }} />Connect</button></>)
                }
            case 'FriendRequests':
                return (
                    <>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '24px' }} />
                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#9b0303', fontSize: '24px' }} />
                    </>)
            case 'MyFriends':
                return (<></>)
            default:
                return null; // You can also return a default icon or null
        }
    };

    return (
        <div className="grid-cards">
            {data.map((item, index) => (
                <div className="card" key={index}>
                    <div className="profile-picture">
                    </div>
                    <p>{item.name}</p>
                    <div>
                        <a>{getIcons(item)}</a>
                        <span className="icon-gap"></span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridCards;
