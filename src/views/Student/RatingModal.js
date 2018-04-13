import React, {Component} from 'react';
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import Rating from 'react-rating';

class RatingModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      rating: 0,
      feedback: ''
    };

    this.toggle = this.toggle.bind(this);

  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    return (
      <div>
        <Button onClick={this.toggle}>Rate Your Tutor</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}></ModalHeader>
          <ModalBody>
            <div className="contrainer-fluid d-flex flex-column">
              <div className="text-center"><h5>{this.state.rating}</h5></div>
              <div className="text-center">
                {
                  <Rating
                    emptySymbol="fa fa-2x medium fa-star-o"
                    fullSymbol="fa fa-2x medium fa-star"
                    initialRating={this.state.rating}
                    onChange={(value)=>{
                      this.setState({
                        rating: value
                      });
                    }}
                  />
                }
              </div>
              <div className="text-center">
                <strong>Rate your tutor</strong>
                <hr/>
              </div>
              <div>
                <Input type="textarea" name="textarea-input" id="textarea-input" rows="3"
                        value={this.state.feedback}
                        onChange={(event)=>{
                          this.setState({
                            feedback: event.target.value
                          });
                        }}
                        placeholder="Feedback"/>
              </div>
            </div>
            
          </ModalBody>
          <ModalFooter>
            <Button color="primary" 
            onClick={
              ()=>{
                this.props.saveRating(this.state.rating, this.state.feedback, this.props.index, this.props.contract, this.toggle);
              }
              
            }
            >Send</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export {RatingModal};
