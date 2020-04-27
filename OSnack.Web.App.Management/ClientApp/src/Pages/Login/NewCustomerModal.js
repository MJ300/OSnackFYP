import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Modal, ModalBody } from 'reactstrap';
import { PageHeader } from '../../Components/Text-OSnack';
import { Input } from '../../Components/Inputs-OSnack';
import { Button } from '../../Components/Buttons-OSnack';

class NewCustomer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
        }
        this.forgotPassword = this.forgotPassword.bind(this);
    }
    async forgotPassword() {

    }
    render() {
        return (
            <Modal isOpen={this.props.isOpen}
                className='modal-dialog modal-dialog-centered'>
                <ModalBody>
                    <PageHeader title="New Customer" />
                    <Input lblText="Email" type="email"
                        defaultValue={this.props.email}
                        onChange={i => this.setState({ email: i.target.value })}
                    />
                    <Button title="Submit" className="col-6 mt-2 btn-green" onClick={this.forgotPassword} />
                    <Button title="Cancel" className="col-6 mt-2 btn-red"
                        onClick={this.props.onCancel} />
                </ModalBody>
            </Modal>
        );
    }
}
/// Mapping the redux state with component's properties
const mapStateToProps = (state) => {
    return {
    }
};
/// Map actions (which may include dispatch to redux store) to component
const mapDispatchToProps = {
}
/// Redux Connection before exporting the component
export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(mapDispatchToProps, dispatch)
)(NewCustomer);
