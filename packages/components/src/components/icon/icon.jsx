import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

function getUrlBase(path = '') {
    const l = window.location;

    if (!/^\/(br_)/.test(l.pathname)) return path;

    return `/${l.pathname.split('/')[1]}${/^\//.test(path) ? path : `/${path}`}`;
}

function getKebabCase(str) {
    if (!str) return str;
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
        .replace(/[\s]+/g, '-')                 // replace all spaces and low dash
        .toLowerCase();
}

const Icon = ({
    className,
    color,
    customColor,
    height,
    icon,
    onClick,
    onMouseEnter,
    onMouseLeave,
    size = 16,
    width,
}) => {
    if (!icon) return null;

    let spriteFileName = 'common';
    if (icon) {
        if (icon.startsWith('IcCurrency')) {
            spriteFileName = 'currency';
        }
        if (icon.startsWith('IcTradetype')) {
            spriteFileName = 'tradetype';
        }
        if (icon.startsWith('IcMt5')) {
            spriteFileName = 'mt5';
        }
        if (icon.startsWith('IcFlag')) {
            spriteFileName = 'flag';
        }
        if (icon.startsWith('IcUnderlying')) {
            spriteFileName = 'underlying';
        }
    }

    const icon_filename = icon.startsWith('IcUnderlying') ? `ic-underlying-${icon.split('IcUnderlying')[1].toUpperCase()}` : getKebabCase(icon);

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            className={classNames('dc-icon', className, {
                'dc-icon--active'   : color === 'active',
                'dc-icon--disabled' : color === 'disabled',
                'dc-icon--green'    : color === 'green' || icon === 'IcProfit',
                'dc-icon--red'      : color === 'red' || icon === 'IcLoss',
                'dc-icon--secondary': color === 'secondary',
                'dc-icon--brand'    : color === 'brand',
            })}
            height={height || size}
            width={width || size}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={customColor ? {
                '--fill-color1': customColor,
            } : undefined}
        >
            <use xlinkHref={`${(getUrlBase(`/public/sprite/${spriteFileName}.svg`))}#${icon_filename}`} />
        </svg>
    );
};

Icon.propTypes = {
    className: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    color: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    customColor: PropTypes.string,
    height     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    icon        : PropTypes.string,
    onClick     : PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default Icon;
