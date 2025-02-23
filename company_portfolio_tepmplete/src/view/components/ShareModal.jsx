import React from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { FaFacebook, FaWhatsapp, FaTelegram, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface ShareModalProps {
    isOpen: boolean;
    toggle: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, toggle }) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check this out!");

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered backdrop="static" >
            <ModalBody className="flex flex-col items-center text-center p-6">
                <h5 className="text-lg font-semibold mb-4">Share this page</h5>
                <div className="flex justify-center items-center gap-4">
                    {/* Facebook */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80"
                    >
                        <FaFacebook size={40} color="#3b5998" />
                    </a>

                    {/* Twitter */}
                    <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80"
                    >
                        <FaXTwitter size={40} color="#1DA1F2" />
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={
                            /Android|iPhone/i.test(navigator.userAgent)
                                ? `whatsapp://send?text=${shareText} ${shareUrl}`
                                : `https://wa.me/?text=${shareText} ${shareUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80"
                    >
                        <FaWhatsapp size={40} color="#25D366" />
                    </a>

                    {/* Telegram */}
                    <a
                        href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80"
                    >
                        <FaTelegram size={40} color="#0088cc" />
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:?subject=Check this out!&body=${shareText}%20${shareUrl}`}
                        className="hover:opacity-80"
                    >
                        <FaEnvelope size={40} color="#EA4335" />
                    </a>
                </div>
            </ModalBody>

            <ModalFooter className="flex justify-center">
                <Button color="secondary" onClick={toggle} className="px-4 py-2 rounded-md">
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ShareModal;
