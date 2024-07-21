import React from 'react';
import styles from './NavigationBar.module.css';
import largeIcon from './assets/logo.png'
import smallIcon from './assets/smallLogo.png'

const NavigationBar = () => {
    return (
        <>
        <div className={styles.navigationBar}>
            <div className={styles.counter}>
                <img src={largeIcon} alt='logo'/>
            </div>
            <div className={styles.notification}>
                <img src="" alt="notification" />
                <span className={styles.notificationBadge}>1</span>
            </div>
        </div>
        </>
    );
}

export default NavigationBar;
