import { createPortal } from 'react-dom';
import { Component } from 'react';

type Props = {
  onClick?: () => void;
};
export default class Modal extends Component<Props> {
  render() {
    //if (!this.state.schedules.showModal) return null;
    return createPortal(
      <div
        id="overlay"
        onClick={this.props.onClick}
        className="min-h-screen fixed top-0 left-0 w-full flex justify-center items-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div
          id="modal-content"
          style={{
            inset: 'auto 29vw',
            borderRadius: '8px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div id="modal-body">{this.props.children}</div>
        </div>
      </div>,
      document.getElementById('modal_root') as Element
    );
  }
}
