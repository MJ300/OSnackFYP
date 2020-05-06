import React from 'react';
import { AlertTypes } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const PageHeader = (props) => {
   const style = {
      fontFamily: '"Antonio", Verdana, sans - serif',
      fontSize: '40px',
      fontWeight: '500',
      lineHeight: '1.5',
      marginBottom: '1rem',
   };
   return (
      <div style={style} className={props.className}>{props.title}</div>
   );
};

export const Alert = (props) => {
   let bgColor = 'rgb(0, 0, 0)';
   let textColor = 'dark';
   switch (props.type) {
      case AlertTypes.Warning:
         bgColor = 'rgb(255, 221, 70)';
         textColor = 'dark';
         break;
      case AlertTypes.Error:
         bgColor = 'rgb(135, 35, 35)';
         textColor = 'white';
         break;
      case AlertTypes.Success:
         bgColor = 'rgb(35, 135, 62)';
         textColor = 'white';
         break;
      default:
         break;
   }


   let style = {
      'background-color': bgColor,
      'font-weight': '600',
      'color': textColor,
      'padding': '5px',
   };
   let output = <div />;
   try {

      if (props.alertItemList.length > 0)
         output =
            <div className={"p-0 " + props.className}>
               <div style={style} className="row col-12 m-0">
                  <div className="col-11">
                     {props.alertItemList.map(error => {
                        return (<div key={error.key}>{error.value}</div>);
                     })}
                  </div>
                  <div className="col-1 p-0 pr-2 text-right">
                     <a onClick={props.onClosed}>✘</a>
                  </div>
               </div>
            </div>;
   } catch (e) { }
   return (output);
};