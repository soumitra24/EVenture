// components/BookingModal.tsx
import { useState } from 'react';

interface EVScooter {
  id: string;
  name: string;
  model: string;
  imageurl: string;
  priceperhour: number;
  maxSpeed: string;
  location: string;
  mileage: string;
  support: string;
  owner: string;
  available: number;
  rating: number;
}

interface BookingModalProps {
  scooter: EVScooter;
  onClose: () => void;
  onSubmit: (bookingData: BookingFormData) => Promise<void>;
}

export interface BookingFormData {
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
}

export default function BookingModal({ scooter, onClose, onSubmit }: BookingModalProps) {
  const [bookingData, setBookingData] = useState<BookingFormData>({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    pickupLocation: "",
    dropoffLocation: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(bookingData);
  };

  // Generate time slots for the dropdown (30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const hourFormatted = hour.toString().padStart(2, '0');
        const minuteFormatted = minute.toString().padStart(2, '0');
        const time = `${hourFormatted}:${minuteFormatted}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Book {scooter.name}</h2>
        
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <div className="flex justify-between">
            <span>Price per hour:</span>
            <span className="font-semibold">₹{scooter.priceperhour}</span>
          </div>
          <div className="flex justify-between">
            <span>Available units:</span>
            <span className="font-semibold">{scooter.available}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="pickupDate" className="block text-gray-700 mb-1">Pickup Date</label>
              <input 
                type="date" 
                id="pickupDate"
                name="pickupDate"
                value={bookingData.pickupDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label htmlFor="pickupTime" className="block text-gray-700 mb-1">Pickup Time</label>
              <select
                id="pickupTime"
                name="pickupTime"
                value={bookingData.pickupTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={`pickup-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="dropoffDate" className="block text-gray-700 mb-1">Drop-off Date</label>
              <input 
                type="date" 
                id="dropoffDate"
                name="dropoffDate"
                value={bookingData.dropoffDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
                min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label htmlFor="dropoffTime" className="block text-gray-700 mb-1">Drop-off Time</label>
              <select
                id="dropoffTime"
                name="dropoffTime"
                value={bookingData.dropoffTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={`dropoff-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-gray-700 mb-1">Pickup Location</label>
            <input 
              type="text" 
              id="pickupLocation"
              name="pickupLocation"
              value={bookingData.pickupLocation}
              onChange={handleInputChange}
              placeholder="Enter pickup location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="dropoffLocation" className="block text-gray-700 mb-1">Drop-off Location</label>
            <input 
              type="text" 
              id="dropoffLocation"
              name="dropoffLocation"
              value={bookingData.dropoffLocation}
              onChange={handleInputChange}
              placeholder="Enter drop-off location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}