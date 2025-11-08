import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1 className="text-3xl font-bold text-gray-900">
                Shosha<span className="text-amber-500">Stylish</span>
            </h1>
            <p className="text-gray-500 mt-1">AI Fashion Session Builder</p>
        </header>
    );
};

export default Header;