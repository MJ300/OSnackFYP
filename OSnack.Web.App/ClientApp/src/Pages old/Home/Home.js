import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import { NavLink, Container } from 'reactstrap'
//import CustomCarousel from '../../components/Carousel/CustomCarousel'
import LoadSpinner from '../../components/Layout/Loading'
import { carouselItems } from './Actions/HomeAction'
import { preloadImages } from '../../components/_Main/AppConst';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Loading: true,
            payload: {
                Items: [],
                Loading: true
            }
        }
    }
    async componentDidMount() {
      /*  let loading = true;
        await preloadImages([{ imagePath: "/Images/core/stand.png" }])
            .then(loaded => {
                loading: loaded
            });

        if (this.state.payload.Items.length == 0) {
            // load the carousel items
            await this.props.carouselItems().then(data => {
                this.setState({ Loading: loading, payload: data });
            });
        }*/
    }
    render() {
        if (this.state.Loading) {
            return <LoadSpinner />
        }
   
        return (
            <div className='bg-transparent'>
                <div>
                    <img src={"/Images/core/stand.png"}
                        alt="OSnack" className="shadow-lg welcome-img" />
                    <div className="text-center bg-white pb-5 pt-3 mt-3 mb-2">
                        <h1 className="welcome-Title">Welcome To Our Delicious Online Shop</h1>
                        <h3 className="welcome-Text">Here at OSnack, we aim to provide Quality Mediterranean Food for you to Enjoy.</h3>
                        <div className="btn"><NavLink tag={Link} to="/Shop" className='btn-orange'>Shop Now</NavLink></div>
                    </div>
                </div>
                <Container className="custom-container">
                    {/*<CustomCarousel products={this.state.payload.Items} />*/}
                </Container>
            </div>
        );
    }
}

const mapDispatchToProps = {
  //  carouselItems
}
export default connect(
    null,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(Home);
