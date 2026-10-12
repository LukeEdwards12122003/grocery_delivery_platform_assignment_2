import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DeliveryOptions() {
    const navigate = useNavigate();

    const [deliveryMethod, setDeliveryMethod] = useState('standard');

    const deliveryOptions = [
        {
            id: 'standard',
            name: 'Standard'
        },
        {
            id: 'express',
            name: 'Express'
        },
        {
            id: 'pickup',
            name: 'Pickup'
        }
    ];

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto mt-20">
            <div className="bg-white p-6 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">
                    Delivery Options
                </h1>

                <p className="mb-6">
                Please select your preferred delivery method
                </p>

                <div className="space-y-3">
                    {deliveryOptions.map(option => (
                    <div
                        key={option.id}
                        onClick={() => setDeliveryMethod(option.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer ${
                        deliveryMethod === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={deliveryMethod === option.id}
                            onChange={() => setDeliveryMethod(option.id)}
                        />
                        <div className="flex-1">
                            <h2 className="font-semibold">
                                {option.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {option.description}
                            </p>
                        </div>
                    </div>
                    </div>
                    ))}
                </div>

            <div className="mt-6 mb-6 border-t"></div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 border border-gray-600 p-2 rounded"
                    >
                    Back
                    </button>

                    <button
                    type="button"
                    className="w-2/3 bg-green-600 text-white p-2 rounded"
                    >
                    Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeliveryOptions;
