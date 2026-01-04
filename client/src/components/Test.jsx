import React, { useState } from "react";

function Test() {
    const [test, setTest] = useState([]);

    function addTest() {
        setTest(prev => [
            ...prev,
            { name: "Test", price: 10 }
        ]);
    }

    return (
        <div>
            <button onClick={addTest}>Add Test</button>

            {test.map((item, index) => (
                <p key={index}>
                    {item.name} - {item.price}
                </p>
            ))}
        </div>
    );
}

export default Test;
