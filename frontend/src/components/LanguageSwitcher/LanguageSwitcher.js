// src/components/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next';
import classNames from 'classnames/bind';
import styles from './LanguageSwitcher.module.scss';

const cx = classNames.bind(styles);

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLang = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className={cx('switch-container')} onClick={toggleLang}>
            <div className={cx('switch-track')}>
                <div className={cx('switch-thumb', i18n.language)}>
                    <span className={cx('label')}>{i18n.language === 'en' ? 'EN' : 'VI'}</span>
                </div>
            </div>
        </div>
    );
}

export default LanguageSwitcher;
