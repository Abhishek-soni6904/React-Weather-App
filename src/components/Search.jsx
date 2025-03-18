import React, { useEffect, useState } from 'react';

export default function Search({ setSearchCity, setError }) {
    const [searchValue, setSearchValue] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchValue.trim() === '') {
            setSearchData([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/search.json?key=777c08406c6e46e3a9d114236251803&q=${searchValue}`
                );

                if (!response.ok) throw new Error('Failed to fetch city data');

                const data = await response.json();
                setSearchData(data);
                setError('');
            } catch (error) {
                setError('Error Occurred: ' + error.message);
                setSearchData([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchValue]);

    return (
        <div className="search-container">
            <input
                type="text"
                list="searchResult"
                placeholder="Enter city name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchData([])}
                className="search-input"
            />
            <button
                onClick={() => {
                    if (searchValue.trim()) {
                        setSearchCity(searchValue);
                    } else {
                        setError('Please enter a valid city name');
                    }
                }}
                disabled={loading || !searchValue.trim()}
                className="search-button"
            >
                {loading ? 'Searching...' : 'Search'}
            </button>

            <datalist id="searchResult">
                {searchData.length > 0 ? (
                    searchData.map((city, index) => (
                        <option key={index} value={city.name} />
                    ))
                ) : (
                    <option value="No results found" disabled />
                )}
            </datalist>
        </div>
    );
}
