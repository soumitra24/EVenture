// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

// Define types for our data
interface Booking {
  id: string;
  created_at: string;
  vehicle_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  license_verified: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session Error:", error.message);
          router.push('/');
          return;
        }
        
        if (!data.session) {
          // User is not logged in, redirect to home
          router.push('/');
          return;
        }
        
        setSession(data.session);
        await fetchUserData(data.session.user.id);
        await fetchActiveBookings(data.session.user.id);
        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error getting session:", err);
        setIsLoading(false);
        router.push('/');
      }
    };
    
    getSession();
  }, [supabase, router]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };
// First, let's update your Booking interface to include the additional fields
interface Booking {
    id: string;
    created_at: string;
    user_id: string;
    vehicle_name: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    pickup_location?: string;
    dropoff_location?: string;
  }
  
// 2. Filtering by status
const fetchActiveBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['confirmed', 'pending'] as Array<Booking['status']>)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
      
      if (error) {
        console.error("Error updating profile:", error);
        return;
      }
      
      await fetchUserData(session.user.id);
      setIsEditing(false);
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with navigation */}
      <header className="bg-black text-white p-4">
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
          <nav className="space-x-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/services" className="hover:text-gray-300">Services</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
            <Link href="/dashboard" className="font-bold">Dashboard</Link>
            <Link href="/admin" className="hover:text-gray-300">Admin Login</Link>
          </nav>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Dashboard header */}
          <div className="bg-gray-800 text-white p-6">
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p className="text-gray-300">Welcome back, {profile?.full_name || session?.user?.email}</p>
          </div>
          
          {/* Tab navigation */}
          <div className="bg-gray-100 px-6 py-4 border-b">
            <div className="flex space-x-6">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 font-medium ${activeTab === 'bookings' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
              >
                Booking History
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 font-medium ${activeTab === 'profile' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
              >
                Profile Details
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Booking History</h2>
                  <Link href="/booking">
                    <button className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md">
                      Book a Vehicle
                    </button>
                  </Link>
                </div>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You haven't made any bookings yet.</p>
                    <Link href="/booking">
                      <button className="mt-4 bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md">
                        Book Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{booking.vehicle_name}</div>
                              <div className="text-sm text-gray-500">Booked on {new Date(booking.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${booking.total_price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link href={`/booking/${booking.id}`}>
                                <span className="text-blue-600 hover:text-blue-900 cursor-pointer">View Details</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Profile</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={session?.user?.email || ''}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            full_name: profile?.full_name || '',
                            phone: profile?.phone || '',
                            address: profile?.address || '',
                          });
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 max-w-lg">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{session?.user?.email}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{profile?.full_name || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{profile?.address || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">License Verification</p>
                      <p className="font-medium">
                        {profile?.license_verified ? (
                          <span className="text-green-600">Verified ✓</span>
                        ) : (
                          <span className="text-red-600">Not Verified</span>
                        )}
                      </p>
                      {!profile?.license_verified && (
                        <Link href="/verify-license">
                          <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline">
                            Verify your license
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}