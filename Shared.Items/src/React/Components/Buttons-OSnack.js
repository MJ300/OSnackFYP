import React, { PureComponent } from 'react';

export const Button = (props) => {
   let id = Math.random();
   return (
      <button id={id} type="button" children={props.title}
         className={"btn " + props.className}
         onClick={props.onClick}
      />
   );
};
export class ButtonPopupConfirm extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         id: Math.random(),
         isOpenDropdown: false,
      };

      // used for auto hiding drop-down list
      this.toggleDropdown = React.createRef(Math.random());
      this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
   }
   async componentDidMount() {
      window.addEventListener("focusin", this.onClickOutsideHandler);
   }
   async componentWillUnmount() {
      window.removeEventListener("focusin", this.onClickOutsideHandler);
   }
   onClickOutsideHandler(event) {
      try {
         if (
            this.state.isOpenDropdown &&
            !this.toggleDropdown.current.contains(event.target)
         ) {
            this.setState({ isOpenDropdown: false });
         }
      } catch (e) { }
   }
   render() {
      const { id, isOpenDropdown } = this.state;
      const { className, title, btnClassName, spanClassName, popupMessage, onConfirmClick } = this.props;
      return (
         <div className={"btn-group form dropup p-0 " + className} ref={this.toggleDropdown}>
            <button id={id} type="button" className={"btn btn-lg mt-auto col-12 m-0 " + btnClassName}
               onClick={() => this.setState({ isOpenDropdown: !isOpenDropdown })}
               children={`${title}${isOpenDropdown ? "?" : ""}`}
            />
            {this.state.isOpenDropdown && (
               <span aria-labelledby={id}
                  className={"dropdown-menu shadow-lg show " + spanClassName}>
                  <div className="col-12 dropdown-item bg-white"
                     children={popupMessage}
                  />
                  <div className="dropdown-item p-0 m-0 mt-2">
                     <button type="button" className={"btn btn-sm btn-green col-6 boarder-radius-none"}
                        onClick={() => {
                           onConfirmClick();
                           this.setState({ isOpenDropdown: false });
                        }}
                        children="Yes"
                     />

                     <button type="button" className={"btn btn-sm btn-red col-6 boarder-radius-none"}
                        onClick={() => this.setState({ isOpenDropdown: false })}
                        children="No"
                     />
                  </div>
               </span>
            )}
         </div>
      );
   }
}
export class DropdownBtn extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         id: Math.random(),
         isOpenDropdown: false,
      };

      // used for auto hiding drop-down list
      this.toggleDropdown = React.createRef(Math.random());
      this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
   }
   async componentDidMount() {
      window.addEventListener("click", this.onClickOutsideHandler);
   }
   async componentWillUnmount() {
      window.removeEventListener("click", this.onClickOutsideHandler);
   }
   onClickOutsideHandler(event) {
      try {
         if (
            this.state.isOpenDropdown &&
            !this.toggleDropdown.current.contains(event.target)
         ) {
            this.setState({ isOpenDropdown: false });
         }
      } catch (e) { }
   }
   render() {
      const { id, isOpenDropdown } = this.state;
      const { className, title, btnClassName, spanClassName, body } = this.props;
      return (
         <div className={"dropdown p-0 " + className}>
            <button id={id} type="button" children={title} ref={this.toggleDropdown}
               className={"dropdown-toggle btn col m-0 " + btnClassName}
               onClick={() => this.setState({ isOpenDropdown: !isOpenDropdown })}
            />
            <span aria-labelledby={id}
               className={`dropdown-menu dd-border ${isOpenDropdown ? "show" : ""}  w-100 ` + spanClassName}
               children={body}
            />
         </div>
      );
   }
}