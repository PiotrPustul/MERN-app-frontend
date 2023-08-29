import ReactDOM from 'react-dom'
import { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import Backdrop from './Backdrop'
import './Modal.css'

const ModalOverlay = (props) => {
  const htmlElement = document.getElementById('modal-hook')
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  )

  return ReactDOM.createPortal(content, htmlElement)
}

const Modal = (props) => {
  const nodeRef = useRef(null)

  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames='modal'
      >
        <ModalOverlay {...props} ref={nodeRef} />
      </CSSTransition>
    </>
  )
}

export default Modal