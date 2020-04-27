import  React from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'reactstrap'

import LoadSpinner from '../Layout/Loading'

// third party carousel
import AliceCarousel from './CarouselLib/react-alice-carousel'
import "./CarouselLib/alice-carousel.css"
import "./Carousel.css"

export default class CustomCarousel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            responsive: {
                256: { items: 1 },
                630: { items: 2 },
                1000: { items: 3 },
                1260: { items: 4 },
                1515: { items: 5 },
                1920: { items: 6 }
            },
            products: props.products
        };
    }
    render() {
        const { products, responsive, currentIndex } = this.state;
        const carouselItems = products.map(i =>
            <div key={i.id} className="bestSeller-slide img-fluid" onDragStart={(e) => e.preventDefault()}>
                <img className="bestSeller-Tag" src={i.bestSeller} alt="" />
                <img className="bestSeller-Img img-fluid" src={i.imagePath.replace(/\//g, "/")} alt="" />
                <NavLink tag={Link} to={"/Shop/" + i.category} className="link-no-underline text-center bestSeller-ItemTitle">
                    <font className="mt-auto mb-auto">{i.name}</font>
                </NavLink>
            </div>)
        return (
            <div className="CarouselContainer">
                <AliceCarousel
                    items={carouselItems}
                    responsive={responsive}
                    duration={2500}
                    autoPlay={true}
                    fadeOutAnimation={false}
                    mouseTrackingEnabled={true}
                    slideToIndex={currentIndex}
                    dotsDisabled={true}
                    buttonsDisabled={true}
                />
            </div>
        )
    }
}
