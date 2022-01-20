import { BookingComponentType } from '../pages/booking/BookingPageTypes';

import { createPortal } from 'react-dom';
import { Component } from 'react';

type Props = {
  children: JSX.Element;
} & BookingComponentType;

export default class Modal extends Component {
  render() {
    //if (!this.state.schedules.showModal) return null;
    return createPortal(
      <div
        id="overlay"
        className="min-h-screen  bg-gray-100 fixed top-0 left-0 w-full flex justify-center items-center"
        onClick={() => console.log('cioa')}
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