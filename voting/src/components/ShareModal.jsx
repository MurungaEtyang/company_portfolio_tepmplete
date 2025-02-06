import React from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { FaFacebook, FaWhatsapp, FaTelegram, FaEnvelope } from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";

interface ShareModalProps {
    isOpen: boolean;
    toggle: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, toggle }) => {
    const shareUrl = window.location.href;
    const shareText = encodeURIComponent("Check this out!");

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalBody>
                <h5 className="text-center">Share this page</h5>
                <div className="d-flex justify-content-around align-items-center mt-3">
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaFacebook size={32} color="#3b5998" />
                    </a>
                    <a
                        href={`https://twitter.com/share?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaXTwitter size={32} color="#1DA1F2" />
                    </a>
                    <a
                        href={`https://wa.me/?text=${shareText} ${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaWhatsapp size={32} color="#25D366" />
                    </a>
                    <a
                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaTelegram size={32} color="#0088cc" />
                    </a>
                    <a
                        href={`https://mail.google.com/mail/u/0/?fs=1&to=&su=Check+this+out!&body=${shareUrl}&bcc=&tf=&trace`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaEnvelope size={32} color="#EA4335" />
                    </a>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ShareModal;

