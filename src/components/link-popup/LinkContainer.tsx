import React, { useState, useEffect } from 'react';
import { state } from '../../App'
import { useRecoilState, atom } from 'recoil';
import { Modal } from './Modal'


const LinkContainer: React.FC = () => {
    const [showContainer, setShowContainer] = useState(true);
    // const [showModal, setShowModal] = useRecoilState(showModal);
    const [data, setData] = useRecoilState(state);

    useEffect(() => {
        toggleScrollLock();
    }, [data])

    const onSubmit = (event) => {
        event.preventDefault(event);
        if ((event.target.link.value).trim() !== '')
            setData({ link: event.target.link.value, modal: false });
        // console.log((event.target.link.value).trim());
    };

    const closeModal = () => {
        setData({ ...data, modal: false });
    };

    const toggleScrollLock = () => {
        document.querySelector('html').classList.toggle('scroll-lock');
    };

    return (
        <React.Fragment>
            {data.modal ? (
                <Modal
                    onSubmit={onSubmit}
                    closeModal={closeModal}
                />
            ) : null}
        </React.Fragment>

    )
}

export default LinkContainer;