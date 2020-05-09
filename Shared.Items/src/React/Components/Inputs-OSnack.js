import React, { PureComponent } from 'react';
import { AlertTypes } from '../../_CoreFiles/CommonJs/AppConst.Shared';
import { Button } from './Buttons-OSnack';
import { ImageCropModal } from './Misc-OSnack';

export const Input = (props) => {
   let key = Math.random();
   if (!(props.keyVal == null))
      key = props.keyVal;
   let outterKey = `${key}1`;
   return (
      <div className={props.className} key={outterKey}>
         {!props.lblDisabled &&
            <label htmlFor={key} className={"col-form-label " + props.lblCss}>{props.lblText}</label>
         }
         <input key={key} type={props.type} className={"form-control " + props.inputClassName}
            defaultValue={props.bindedValue}
            placeholder={props.placeholder}
            onChange={props.onChange}
            disabled={props.disabled || false}
         />
      </div>
   );
};

export class ImageUpload extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         key: props.key,
         alertList: [],
         alertType: AlertTypes.Error,
         selectedImageBase64: '',
         isOpenImageCropModal: false,
         isPreviewImageOn: false,
         croppedImage: ''
      };
      this.uploadDocument = this.uploadDocument.bind(this);
      this.onCropCompleted = this.onCropCompleted.bind(this);
   }
   async uploadDocument(files) {
      Promise.all([].map.call(files, (file) => {
         return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onloadend = () => {
               resolve({ result: reader.result, file: file });
            };
            reader.readAsDataURL(file);
         });
      })).then(async (results) => {
         try {
            this.setState({
               selectedImageBase64: results[0].result,
               isOpenImageCropModal: true
            });
         } catch (e) { }
      });
   }
   async onCropCompleted(result) {

      this.setState({
         croppedImage: result.base64Image,
         isOpenImageCropModal: false
      });

      try {
         await this.props.onUploaded(this.state.croppedImage);
      } catch (e) { }
   }
   async componentDidUpdate() {
      const { initBase64 } = this.props;

      if (!(initBase64 == null) && initBase64 != '' && initBase64 !== this.state.croppedImage
         && this.state.croppedImage == ''
         && this.state.selectedImageBase64 == '') {
         this.state.selectedImageBase64 = initBase64;
         this.state.croppedImage = initBase64;
         this.forceUpdate();
      }
   }
   render() {
      const { className } = this.props;


      let { alertList, alertType, croppedImage, isOpenImageCropModal,
         isPreviewImageOn, selectedImageBase64, key } = this.state;

      if (this.props.key == null)
         key = Math.random();

      return (
         <div className={"row p-0 " + className} key={key}>
            {/***** Preview Image ****/}
            {croppedImage != '' && isPreviewImageOn &&
               <div className="row col-12 col-sm-9 p-0 m-0 ml-auto mr-auto">
                  <img className="shop-card-product mr-auto ml-auto" src={croppedImage} />
                  {!isOpenImageCropModal && selectedImageBase64 &&
                     <button className="btn btn-sm btn-blue col-6 mr-auto ml-auto mb-3"
                        onClick={() => this.setState({ isOpenImageCropModal: true })}
                        children="Edit Image"
                     />
                  }
               </div>
            }
            <div className={`col-12 col-md-auto p-md-0 ${croppedImage != '' ? " pl-md-3" : ""}`}>
               {croppedImage != '' &&
                  <Button title={`Preview Image ${isPreviewImageOn ? "On" : ""}`}
                     className={`col-12 mb-2 mb-md-0  ${isPreviewImageOn ? "btn-success" : "btn-blue"}`}
                     onClick={() => this.setState({ isPreviewImageOn: !isPreviewImageOn })} />
               }
            </div>
            <div className="col-12 col-md mt-1 mt-md-0">
               <div className="custom-file">
                  <input id="uploadImage" type="file" accept="/*" className="custom-file-input"
                     onChange={e => this.uploadDocument(e.target.files)}
                  />
                  <div id="lblUploadImage" className="custom-file-label">Upload Product Image</div>
               </div>
            </div>
            {/***** Modal Image Drop-down ****/}
            <ImageCropModal base64Image={this.state.selectedImageBase64}
               toggle={() => this.setState({ isOpenImageCropModal: !isOpenImageCropModal })}
               isOpen={isOpenImageCropModal}
               onCancel={() => this.setState({ isOpenImageCropModal: false })}
               onCropComplete={this.onCropCompleted}
            />
         </div>
      );
   }
};

export const DropdownInput = (props) => {
    const id = Math.random();
    return (
        <div className={props.className}>
            {!props.lblDisabled &&
                <label htmlFor={id} className={"col-form-label " + props.lblCss}>{props.lblText}</label>
            }
            <select id={id}
                onChange={i => props.onChange(JSON.parse(i.target.value))}
                className={"form-control " + props.inputCss}>
                <option disabled children={props.placeholder || `Choose ${props.lblText}`}
                    selected={!(props.selectedValue == null) && props.selectedValue !== '' ? false : true} />
                {props.list.map(i =>
                    <option value={JSON.stringify(i)} key={i.name} children={i.name}
                        selected={i.id === props.selectedValue || i.name === props.selectedValue ? true : false}
                    />
                )}
            </select>
        </div>
    );
};

export const CheckBox = (props) => {
   const id = Math.random();
   return (
      <div className={"custom-control custom-checkbox " + props.className}>
         <input type="checkbox" id={id} class="custom-control-input"
            onClick={props.onClick} />
         <label className="custom-control-label" htmlFor={id} >{props.lblText}</label>
      </div>
   );
};

