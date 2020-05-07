import React, { PureComponent } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import Cropper from 'react-easy-crop';
import { Slider } from '@material-ui/core';
import { Row } from 'reactstrap';
import { PageHeader } from './Text-OSnack';
import { Button } from './Buttons-OSnack';
import { ConstMaxNumberOfPerItemsPage } from '../../_CoreFiles/CommonJs/AppConst.Shared';

export const Loading = (props) => {
   return (
      <img className={"loading-spinner"}
         src={"/Images/core/LoadSpinner.gif"} alt="Loading..." />
   );
};

export class Pagination extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         listCount: this.props.listCount,
         SelectedPage: 1,
         MaxItemsPerPage: ConstMaxNumberOfPerItemsPage,
         arrayOfPageNumbers: [],
         totalPages: 1
      };
      if (props.listCount == null) { throw new Error("Total count of the entire list is required"); }
      if (props.setList == null) { throw new Error("Set List function is required to filter the list with 'selectedPage' and 'MaxItemsPerPage' variables."); }

      this.onMaxItemPerPageChange = this.onMaxItemPerPageChange.bind(this);
      this.CalculateVisibleButtons = this.CalculateVisibleButtons.bind(this);
      this.onButtonClick = this.onButtonClick.bind(this);
   }
   async componentDidMount() {
      if (this.props.setListOnLoad) {
         await this.props.setList(this.state.SelectedPage, this.state.MaxItemsPerPage);
         await this.CalculateVisibleButtons();
      }
   }

   async onMaxItemPerPageChange(maxItemsPerPage) {
      this.state.MaxItemsPerPage = maxItemsPerPage;
      await this.props.setList(this.state.SelectedPage, this.state.MaxItemsPerPage);
      await this.CalculateVisibleButtons();
   }
   async onPageAddOrMinus(AddPage) {

      let pendingSelectedPage = this.state.SelectedPage + AddPage;
      if ((pendingSelectedPage > 0 && pendingSelectedPage <= this.state.totalPages)) {
         this.state.SelectedPage = pendingSelectedPage;
         await this.props.setList(this.state.SelectedPage, this.state.MaxItemsPerPage);
         this.CalculateVisibleButtons();
      }
   }
   async onButtonClick(pageNum) {
      this.state.SelectedPage = pageNum;
      await this.props.setList(this.state.SelectedPage, this.state.MaxItemsPerPage);
      this.CalculateVisibleButtons();
   }
   async CalculateVisibleButtons() {
      let firstPage = 1, lastPage = 1, maxButtonsToBeShown = 4, halfMaxButtonsToBeShown = Math.floor(maxButtonsToBeShown / 2);

      if (this.state.listCount == 0)
         return;

      const remainder = Math.floor(this.state.listCount % this.state.MaxItemsPerPage);
      /// if the remainder is 0
      if (remainder === 0)
         /// the total page is the result of item list count divided
         /// by max items per page value
         this.state.totalPages = Math.floor(this.state.listCount / this.state.MaxItemsPerPage);
      /// else if the remainder is more than 0
      else if (remainder > 0)
         /// The total page is the result of item list count divided
         /// by max items per page value, plus one
         this.state.totalPages = Math.floor(this.state.listCount / this.state.MaxItemsPerPage) + 1;

      if (this.state.SelectedPage >= this.state.totalPages) {
         this.state.SelectedPage = this.state.totalPages;
         await this.props.setList(this.state.SelectedPage, this.state.MaxItemsPerPage);
      }

      /// if the current page is less than half of the
      /// max number of buttons to be shown.
      /// (The beginning of the pagination is shown)
      if (this.state.SelectedPage < halfMaxButtonsToBeShown) {
         /// set the First page to the current page
         firstPage = 1;
         if (this.state.totalPages < maxButtonsToBeShown)
            lastPage = this.state.totalPages;
         else
            /// set the Last page the max number of buttons to be shown
            lastPage = maxButtonsToBeShown;

      }

      /// current page is more than the total number of pages
      /// minus half of the Max number of pages to be shown
      /// (The end of the pagination is shown)
      else if (this.state.SelectedPage > this.state.totalPages - halfMaxButtonsToBeShown) {
         /// the fist page would be the result of the
         /// selected page minus the product of Max number of buttons
         /// minus the result of total pages - selected page
         firstPage = this.state.SelectedPage
            - (maxButtonsToBeShown
               - (this.state.totalPages - this.state.SelectedPage));

         /// and the last page would the value of total pages
         /// which is the last possible position
         lastPage = this.state.totalPages;

      } else {
         firstPage = this.state.SelectedPage - halfMaxButtonsToBeShown;
         lastPage = this.state.SelectedPage + halfMaxButtonsToBeShown;
      }
      if ((lastPage - firstPage) >= maxButtonsToBeShown)
         firstPage++;
      this.state.arrayOfPageNumbers = [];

      if (firstPage <= 0)
         firstPage = 1;

      while (firstPage <= lastPage) {
         this.state.arrayOfPageNumbers.push(firstPage);
         firstPage++;
      }

      if (lastPage < maxButtonsToBeShown && (lastPage + 1) <= this.state.totalPages)
         this.state.arrayOfPageNumbers.push(lastPage + 1);

      this.forceUpdate();
   }
   render() {
      if (this.state.listCount != this.props.listCount) {
         this.state.listCount = this.props.listCount;
         this.CalculateVisibleButtons();
      }
      this.setState({ listCount: this.props.listCount });
      const btnClassName = "col-auto btn btn-outline-info boarder-radius-none outline-none ";
      return (
         this.state.arrayOfPageNumbers.length > 0 &&
         <div className="row col-12 p-0 m-0">
            <button
               type="button"
               className={btnClassName}
               children="<"
               onClick={() => this.onPageAddOrMinus(-1)}
            />
            {this.state.arrayOfPageNumbers.map(i => {

               let isActiveCss = "";
               if (i === this.state.SelectedPage)
                  isActiveCss = " active";

               return (
                  <button
                     type="button"
                     className={btnClassName + isActiveCss}
                     children={i}
                     onClick={async () => await this.onButtonClick(i)}
                  />);
            }
            )}
            <button
               type="button"
               className={btnClassName}
               children=">"
               onClick={() => this.onPageAddOrMinus(1)}
            />
            <select className="w-auto form-control outline-none"
               onChange={(i) => { this.onMaxItemPerPageChange(i.target.value); }}
            >
               <option value="1" children="1" />
               <option value="2" children="2" />
               <option selected value="5" children="5" />
               <option value="10" children="10" />
               <option value="20" children="20" />
               <option value="30" children="30" />
               <option value="40" children="40" />
               <option value="50" children="50" />
               <option value="60" children="60" />
               <option value="70" children="70" />
               <option value="80" children="80" />
               <option value="90" children="90" />
               <option value="100" children="100" />
            </select>
            <div className="col-auto align-self-center ml-auto" children={`Total items found: ${this.props.listCount}`} />
         </div>
      );
   }
}

// https://www.npmjs.com/package/react-easy-crop
//License MIT
export class ImageCropModal extends PureComponent {
   constructor(props) {
      super(props);
      this.state = {
         crop: { x: 0, y: 0 },
         zoom: 1,
         rotation: 0,
         aspect: 4 / 3,
         croppedAreaPixels: null,
      };
   }

   /** Copied from read me section of https://github.com/DominicTobias/react-image-crop#props
 * and https://codesandbox.io/s/q8q1mnr01w?file=/src/cropImage.js:1470-1616
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
   async getCroppedImg(imageSrc, crop, rotation) {
      const image = await this.createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      // set each dimensions to double largest dimension to allow for a safe area for the
      // image to rotate in without being clipped by canvas context
      canvas.width = safeArea;
      canvas.height = safeArea;

      // translate canvas context to a central location on image to allow rotating around the center.
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-safeArea / 2, -safeArea / 2);

      // draw rotated image and store data.
      ctx.drawImage(
         image,
         safeArea / 2 - image.width * 0.5,
         safeArea / 2 - image.height * 0.5
      );

      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // set canvas width to final desired crop size - this will clear existing context
      canvas.width = crop.width;
      canvas.height = crop.height;

      // paste generated rotate image with correct offsets for x,y crop values.
      ctx.putImageData(
         data,
         0 - safeArea / 2 + image.width * 0.5 - crop.x,
         0 - safeArea / 2 + image.height * 0.5 - crop.y
      );

      // As Base64 string
      const base64Image = canvas.toDataURL('image/png');
      const blobImage = new Promise((resolve, reject) => {
         canvas.toBlob(blob => {
            blob.name = "UploadedImage";
            resolve(blob);
         }, 'image/png', 1);
      });
      // return both the blob and base64
      return { base64Image: base64Image, blobImage: blobImage };
   }
   async createImage(url) {
      return new Promise((resolve, reject) => {
         const image = new Image();
         image.addEventListener('load', () => resolve(image));
         image.addEventListener('error', error => reject(error));
         image.src = url;
      });
   }
   async onCropComplete() {
      const result = await this.getCroppedImg(
         this.props.base64Image,
         this.state.croppedAreaPixels,
         this.state.rotation);
      this.props.onCropComplete(result);
   };

   onZoomChange = zoom => {
      this.setState({ zoom });
   };

   render() {
      return (
         <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}
            className='modal-dialog modal-dialog-centered' >
            <ModalBody >
               <PageHeader title='Crop the image' />
               <Cropper
                  classes={{ containerClassName: "col-12 col-sm-9 ml-auto mr-auto" }}
                  image={this.props.base64Image}
                  crop={this.state.crop}
                  zoom={this.state.zoom}
                  rotation={this.state.rotation}
                  aspect={this.state.aspect}
                  onZoomChange={zoom => this.setState({ zoom: zoom })}
                  onCropChange={crop => this.setState({ crop: crop })}
                  onRotationChange={rotation => this.setState({ rotation })}
                  onCropComplete={(croppedArea, croppedAreaPixels) => this.setState({ croppedAreaPixels })}
                  onZoomChange={this.onZoomChange}
               />
               <Row className="col-12 mt-2 pt-2">
                  <label children="Zoom" className="col-3" />
                  <div className="col-9 p-0">
                     <Slider
                        min={1}
                        max={4}
                        step={0.1}
                        aria-labelledby="Zoom"
                        value={this.state.zoom}
                        onChange={(e, zoom) => this.onZoomChange(zoom)}
                     />
                  </div>
               </Row>
               <Row className="col-12 mt-2 pt-2">
                  <label children="Rotation" className="col-3" />
                  <div className="col-9 p-0">
                     <Slider
                        min={0}
                        max={360}
                        step={0.1}
                        aria-labelledby="rotation"
                        value={this.state.rotation}
                        onChange={(e, rotate) => this.setState({ rotation: rotate })}
                     />
                  </div>
               </Row>

               <Button title="Cancel"
                  className="col-12 col-sm-6 mt-2 btn-white"
                  onClick={this.props.onCancel} />
               <Button title="Crop"
                  className="col-12 col-sm-6 mt-2 btn-green"
                  onClick={this.onCropComplete.bind(this)}
               />
            </ModalBody>
         </Modal>
      );
   }
}