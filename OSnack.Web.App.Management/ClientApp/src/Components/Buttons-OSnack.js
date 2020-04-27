import React from 'react';

export const Button = (props) => {
    return (
        <button className={"btn btn-lg " + props.className}
            onClick={props.onClick}
        >{props.title}
        </button>
    );
}