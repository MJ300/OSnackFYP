import React from 'react';

export const Input = (props) => {
    return (
        <div>
            <label className={"col-form-label " + props.lblCss}>{props.lblText}</label>
            <input type={props.type} className={"form-control " + props.inputCss}
                defaultValue={props.defaultValue}
                onChange={props.onChange}
            />
        </div>
    );
}

export const CheckBox = (props) => {
    return (
        <div className={"custom-control custom-checkbox " + props.className}>
            <input type="checkbox" id="checkBox" class="custom-control-input"
                onClick={props.onClick} />
            <label className="custom-control-label" htmlFor='checkBox' >{props.lblText}</label>
        </div>
    );
}
