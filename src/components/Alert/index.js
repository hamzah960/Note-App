import React from "react";

const Alert = (props) => (
    <div className="alert-container">
        <ul>
            {props.validationMessages.map((messsage, index) => <li key={index}>{messsage}</li>)}
        </ul>
    </div>
);

export default Alert;
