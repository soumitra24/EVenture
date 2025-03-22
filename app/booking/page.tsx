// app/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import BookingModal, { BookingFormData } from "../components/BookingModal";

// Define the EV scooter type
interface EVScooter {
  id: string;
  name: string;
  model: string;
  imageurl: string;
  priceperhour: number;
  maxspeed: string;
  location: string;
  mileage: string;
  support: string;
  owner: string;
  available: number;
  rating: number;
}


// Define the booking type
interface Booking {
  id?: string;
  user_id: string;
  scooter_id: string;
  pickup_date: string;
  pickup_time: string;
  dropoff_date: string;
  dropoff_time: string;
  pickup_location: string;
  dropoff_location: string;
  created_at?: string;
  status?: string;
}

export default function BookingPage() {
  const [evScooters, setEvScooters] = useState<EVScooter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScooter, setSelectedScooter] = useState<EVScooter | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Fetch user data and EV scooters
  useEffect(() => {
    const fetchUserAndScooters = async () => {
      setLoading(true);
      
      try {
        // Get the current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User not authenticated, will be handled by ProtectedRoute
          return;
        }
        
        setUserId(session.user.id);
        
        // Fetch scooters from Supabase
        const { data: scootersData, error } = await supabase
          .from('scooters')
          .select('*');
        
        if (error) {
          console.error('Error fetching scooters:', error);
          throw error;
        }
        
        if (scootersData) {
          setEvScooters(scootersData as EVScooter[]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndScooters();
  }, [supabase]);

  const handleBookingClick = (scooter: EVScooter) => {
    if (scooter.available > 0) {
      setSelectedScooter(scooter);
      setShowBookingModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedScooter(null);
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    if (!userId || !selectedScooter) return;
    
    try {
      // Create a new booking record in the database
      const newBooking: Booking = {
        user_id: userId,
        scooter_id: selectedScooter.id,
        pickup_date: bookingData.pickupDate,
        pickup_time: bookingData.pickupTime,
        dropoff_date: bookingData.dropoffDate,
        dropoff_time: bookingData.dropoffTime,
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        status: 'confirmed'
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select();
      
      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
      
      // Update the available count for the selected scooter
      const { error: updateError } = await supabase
        .from('scooters')
        .update({ available: selectedScooter.available - 1 })
        .eq('id', selectedScooter.id);
      
      if (updateError) {
        console.error('Error updating scooter availability:', updateError);
        throw updateError;
      }
      
      
      // Update local state
      setEvScooters(prev => 
        prev.map(scooter => 
          scooter.id === selectedScooter.id 
            ? { ...scooter, available: scooter.available - 1 }
            : scooter
        )
      );
      
      alert(`Booking confirmed for ${selectedScooter.name}! We've sent the details to your email.`);
      setShowBookingModal(false);
      setSelectedScooter(null);
      
      // Optionally, redirect to a booking confirmation page
      // router.push(`/booking/confirmation/${data[0].id}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again later.');
    }
    
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-black text-white p-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src="/download.svg" 
                  alt="EVenture Logo" 
                  className="h-8 w-8"
                />
                <span className="ml-2 text-2xl font-light">EVenture</span>
              </div>
            </Link>
            
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link href="/services" className="hover:text-gray-300">Services</Link></li>
                <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-8">Book Your EV Scooter</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">Loading available scooters...</p>
                <p>Please wait while we fetch the latest availability.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {evScooters.map((scooter) => (
                <div 
                  key={scooter.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200">
                    <div className={`absolute top-2 right-2 z-10 py-1 px-3 rounded-full text-white ${scooter.available > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {scooter.available > 0 ? 'Available' : 'Unavailable'}
                    </div>
                    <img 
                      src={scooter.imageurl}
                      alt={scooter.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold">{scooter.name}</h2>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{scooter.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{scooter.model}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{scooter.location}</span>
                      </div>
                      <div className="flex justify-end">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{scooter.support}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{scooter.maxspeed}</span>
                      </div>
                      <div className="flex justify-end">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h-4V6H4a1 1 0 00-1-1z" />
                          <path d="M14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5h-4V7z" />
                        </svg>
                        <span className="text-sm">{scooter.mileage}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-gray-600 text-sm">Owned by</span>
                        <p className="font-medium">{scooter.owner}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Available</span>
                        <p className="font-medium text-center">{scooter.available}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-purple-600 text-2xl font-bold">₹{scooter.priceperhour}/hr</p>
                      <button 
                        onClick={() => handleBookingClick(scooter)}
                        disabled={scooter.available === 0}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          scooter.available > 0 
                            ? 'bg-black text-white hover:bg-gray-800' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {scooter.available > 0 ? 'Book Now' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        
        {/* Render Booking Modal as a separate component */}
        {showBookingModal && selectedScooter && (
          <BookingModal 
            scooter={selectedScooter}
            onClose={handleCloseModal}
            onSubmit={handleBookingSubmit}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}