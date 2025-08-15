import React, { useState } from "react";

// The shape of the request body for creating a Telebirr order.
interface CreateOrderRequestBody {
  title: string;
  amount: string;
}

// The component for the "Pay for Document" button.
const PayForDocButton = ({
  amount,
}: {
  amount: string;
}) => {
  const title = 'Buy Document';
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State to track if the payment was a success.
  // We can use this to style the message differently.
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Function to handle the payment process.
  const startPay = async () => {
    // Reset states at the beginning of the process.
    setIsLoading(true);
    setMessage('Initiating payment...');
    setIsSuccess(false);

    try {
      // Make a POST request to the API to initiate the payment.
      const response = await fetch(`/api/telebirr/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          amount,
        } as CreateOrderRequestBody), 
      });

      // Check if the response was successful.
      if (!response.ok) {
        // If the response is not OK, log the raw response body for debugging.
        const errorBody = await response.text();
        console.error('API Response Body (for debugging):', errorBody);
        
        throw new Error('Failed to create Telebirr order. Please check the console for details.');
      }

      const rawRequest = await response.text();
      const paymentUrl = rawRequest.trim();

      // Ensure a valid URL was received before proceeding.
      if (!paymentUrl) {
        throw new Error('No payment URL received from the server.');
      }

      console.log('Assembled URL:', paymentUrl);

      // Open the payment URL in a new tab without direct DOM manipulation.
      // This is a standard and safe way to handle external redirects.
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      
      // Update the message and success state for user feedback.
      setMessage('Redirecting to Telebirr. Please check the new tab.');
      setIsSuccess(true);

    } catch (error) {
      console.error('ERROR:', error);
      // Display a user-friendly error message.
      setMessage(`Error: ${(error as Error).message}`);
      setIsSuccess(false);
    } finally {
      // Always set loading to false, regardless of success or failure.
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startPay}
        disabled={isLoading}
        className="
          w-full px-6 py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out
          bg-gradient-to-r from-green-600 to-green-500 rounded-lg shadow-md
          hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
          disabled:from-gray-400 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none
        "
      >
        {isLoading ? 'Processing...' : `Buy document for ${amount} in Telebirr`}
      </button>

      {message && (
        <div
          className={`mt-4 p-4 text-sm text-center rounded-lg shadow-inner ${
            isSuccess 
              ? 'text-green-800 bg-green-100 border border-green-200' 
              : 'text-red-800 bg-red-100 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default PayForDocButton;
