import React, { useState, useEffect } from 'react';
import { dbLink } from '../../App'
import { useRecoilState } from 'recoil';
import { Modal } from './Modal'


const LinkContainer: React.FC = () => {
    const [showContainer, setShowContainer] = useState(true)
    const [link, setLink] = useRecoilState(dbLink)

    useEffect(() => {
        toggleScrollLock();
    }, [showContainer])

    const onSubmit = (event) => {
        event.preventDefault(event);
        if ((event.target.link.value).trim() !== '') setShowContainer(false)
        setLink(event.target.link.value)
        // console.log((event.target.link.value).trim());
    };

    const closeModal = () => {
        setShowContainer(false)
    };

    const toggleScrollLock = () => {
        document.querySelector('html').classList.toggle('scroll-lock');
    };

    return (
        <React.Fragment>
            {showContainer ? (
                <Modal
                    onSubmit={onSubmit}
                    closeModal={closeModal}
                />
            ) : null}
        </React.Fragment>

    )
}

export default LinkContainer;