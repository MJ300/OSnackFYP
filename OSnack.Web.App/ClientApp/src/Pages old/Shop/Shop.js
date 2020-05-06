import * as React from 'react';
import { Link } from 'react-router-dom';
import './Shop.css'
import { Container } from 'reactstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProductCategories, getProducts, addProductToOrder } from './Actions/ShopAction';
import Loading from '../../components/Layout/Loading';

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            products: [],
            selectedCategory: "",
            hideCategory: false,
            loading: true
        };
        this.getProducts = this.getProducts.bind(this);
        this.renderProducts = this.renderProducts.bind(this);
    }
    async componentDidMount() {
        const categoryName = window.location.pathname.replace("/Shop/", "").replace("/Shop", "");
        await this.props.getProductCategories().then(data => {
            if (categoryName.length > 0) {
                const category = data.categories.find(i => {
                    if (i.name.replace(" ", "") == categoryName)
                        return i;
                    return null;
                });
                if (category != null) {
                    this.getProducts(category.id, category.name);
                }
            } else {
                console.log(data.categories)
                this.setState({
                    categories: data.categories,
                    loading: data.Loading
                });
            }
        });
    }
    componentDidUpdate() {
        if (window.location.pathname != "/Shop" && this.state.products.length > 0) {
            console.log("not shop")
            this.setState({ products: [], hideCategory: false })
        } 
    }

    getProducts(categoryId, categoryName) {
        this.props.getProducts(categoryId).then(data => {
            this.setState({
                products: data.products,
                selectedCategory: categoryName,
                hideCategory: true,
                loading: false
            });
        });
    }
    renderProducts() {
        if (this.state.products.length > 0) {
            return (
                <Container >
                    <Row className="row justify-content-center text-center">
                        <Link className="breadcrumb-item text-black-50 text-centre" to={window.location.pathname}>
                            <h1 className="font-weight-bold">{this.state.selectedCategory}</h1>
                        </Link>
                    </Row>
                    <Row className="row mt-0 mb-4 justify-content-center">
                        {this.state.products.map(product => {
                            {
                                if ((!!this.props.order.products.find((i) => i.id == product.id))) {
                                    this.props.order.products.find((value, index, obj) => {
                                        if (value.id == product.id)
                                            return value.orderQuantity;
                                        return 0;
                                    })
                                }
                            }
                            return (
                                <Row key={product.id} className="removeUnderline p-0 mb-4 shop-card-product">
                                    <Row className="shop-card p-0">
                                        <img className="img-fluid shop-card-img" src={product.imagePath} alt={product.name} />
                                        <Row className="shop-card-quantity" >
                                            <input className="col-4 m-0 border-0 bg-white text-center" defaultValue={product.orderQuantity} type="text" />
                                            <button type="button" className="col-3 border-0 m-0 text-center bg-danger"
                                                onClick={() => { product.orderQuantity = - 1 }}>
                                                <font className="text-white font-weight-bolder m-0" >-</font>
                                            </button>
                                            <button type="button" className="col-3 border-0 m-0 text-center bg-success"
                                                onClick={() => {
                                                    this.props.addProductToOrder(
                                                        product,
                                                        this.props.order.products
                                                    )
                                                }}>
                                                <font className="text-white font-weight-bold m-0" >+</font>
                                            </button>
                                        </Row>
                                    </Row>
                                    <Row>
                                        <h4 className="font-weight-bold">{product.name}</h4>
                                        <h5>£<font>{product.price}</font> {product.unitQuantity} {product.unit}</h5>
                                        <p>{product.description}</p>
                                    </Row>
                                </Row>
                            )
                        })}
                    </Row>
                </Container>
            )
        }  
    }
    render() {
        if (this.state.loading)
            return (<Loading />);
        return (
            <Row>
                {this.renderProducts()}
                <Container className={this.state.hideCategory ? "hideMe" : "showMe"}>
                    <Row className="row justify-content-center text-center">
                        <Link className="breadcrumb-item text-black-50 text-centre" to="/Shop">
                            <h1 className="font-weight-bold">Product Categories</h1>
                        </Link>
                    </Row>

                    <Row className="row mt-0 mb-4 justify-content-center">
                        {this.state.categories.map(category => {
                            console.log(category.nam)
                            let cssClass = ""
                            if (category.id == 0)
                                cssClass = "mb-5";
                            return (
                                <Link key={category.id} className="m-md-3 shop-card"
                                    onClick={() => this.getProducts(category.id.toString(), category.name)}
                                    to={"/Shop/" + category.name.replace(' ', '')}>
                                    <img className={"img-fluid shop-card-product-img " + cssClass} src={category.imagePath} alt={category.name} />
                                    <h2 className="shop-card-title">{category.name}</h2>
                                </Link>
                            )
                        })}
                    </Row>
                </Container>
            </Row>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        order: state.order
    }
};
const mapDispatchToProps = {
    getProductCategories,
    getProducts,
    addProductToOrder
}
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(Shop);