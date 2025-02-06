import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './Register.css';

const AuthForm = ({ closeModal }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true'); // Simulate login
        closeModal(); // Close the modal after successful login
    };

    const handleRegister = () => {
        localStorage.setItem('isLoggedIn', 'true'); // Simulate registration
        closeModal(); // Close the modal after registration
    };

    return (
        <Modal isOpen={true} toggle={closeModal} centered>
            <ModalHeader toggle={closeModal}>{isLogin ? 'Login' : 'Register'}</ModalHeader>
            <ModalBody>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    <div>
                        <input type="text" placeholder="Enter username" required />
                    </div>
                    <div>
                        <input type="password" placeholder="Enter password" required />
                    </div>
                    <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
                </form>
            </ModalBody>
            <ModalFooter>
                <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <span onClick={handleToggle} className="toggle-link">
            {isLogin ? 'Register' : 'Login'}
          </span>
                </p>
            </ModalFooter>
        </Modal>
    );
};

export default AuthForm;
