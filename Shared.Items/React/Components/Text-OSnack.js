import React from 'react';

export const PageHeader = (props) => {
    const style = {
        'font-family': '"Antonio", Verdana, sans - serif',
        'font-size': '40px',
        'font-weight': '500',
        'line-height': '1.5',
    }
    return (
        <div style={style}>{props.title}</div>
    );
}

export const Alert = (props) => {
    let bgColor = 'rgb(0, 0, 0)';
    let textColor = 'dark'
    switch (props.type) {
        case 'Warning':
            bgColor = 'rgb(255, 221, 70)';
            textColor = 'dark'
            break;
        case 'Error':
            bgColor = 'rgb(135, 35, 35)';
            textColor = 'white'
            break;
        case 'Success':
            bgColor = 'rgb(35, 135, 62)';
            textColor = 'white'
            break;
        default:
            break;
    }


    let style = {
        'background-color': bgColor,
        'font-weight': '600',
        'color': textColor,
        'padding': '5px',
    }
    let output = <div />
    try {

        if (props.alertItemList.length > 0)
            output =
                <div className={"p-0" + props.className}>
                    <div style={style} className="row col-12 m-0">
                        <div className="col-11">
                            {props.alertItemList.map(error => {
                                return (<div key={error.key}>{error.value}</div>)
                            })}
                        </div>
                        <a className="col-1 p-0" onClick={props.onClosed}>✘</a>
                    </div>
                </div>;
    } catch (e) { }
    return (output);
}