import { createPortal } from 'react-dom';
import { Component } from 'react';

export default class Modal extends Component {
  click?: () => any;
  constructor(props: any) {
    super(props);
    this.click = props.click;
    console.log(props, 'this.click');
  }

  render() {
    //if (!this.state.schedules.showModal) return null;
    return createPortal(
      <div
        id="overlay"
        onClick={this.click}
        className="min-h-screen  bg-gray-100 fixed top-0 left-0 w-full flex justify-center items-center"
      >
        <div
          id="modal-content"
          className="bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div id="modal-body">{this.props.children}</div>
        </div>
      </div>,
      document.getElementById('modal_root') as Element
    );
  }
}
