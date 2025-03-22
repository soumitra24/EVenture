// app/page.tsx - Modified version with protected route
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router for redirection
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/auth-helpers-nextjs";

export default function Home() {
  const router = useRouter(); // Initialize the router
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session Error:", error.message);
        } else {
          setSession(data.session);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error getting session:", err);
        setIsLoading(false);
      }
    };
    
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setAuthError(error.message);
      } else {
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setAuthError('An unexpected error occurred');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError('');
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        alert('Please check your email for a confirmation link');
      }
    } catch (err) {
      console.error("Unexpected error during sign up:", err);
      setAuthError('An unexpected error occurred');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout Error:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  // New function to handle the booking button click
  const handleBooking = () => {
    if (session) {
      // User is logged in, redirect to booking page
      router.push('/booking');
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="relative h-screen">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: "url('./image.png')", 
            backgroundSize: 'cover',
            filter: 'brightness(0.3)'
          }}
        />
        
        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">
                {isSignUp ? 'Create Account' : 'Login to EVenture'}
              </h2>
              
              <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                    minLength={6}
                  />
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {authError}
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-md"
                  >
                    {isSignUp ? 'Sign Up' : 'Login'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              
              <div className="text-center border-t pt-4">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsSignUp(false)} 
                      className="text-blue-600 hover:underline"
                    >
                      Login
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsSignUp(true)} 
                      className="text-blue-600 hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="relative z-20 flex justify-between items-center p-6">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src="/download.svg" 
                  alt="EVenture Logo" 
                  className="h-10 w-10 text-white"
                />
                <span className="ml-2 text-white text-3xl font-light">EVenture</span>
              </div>
            </Link>
          </div>

          <div className="md:flex space-x-8">
            <Link href="/" className="text-white hover:text-gray-300 cursor-pointer">Home</Link>
            <Link href="/services" className="text-white hover:text-gray-300">Services</Link>
            <Link href="/about" className="text-white hover:text-gray-300">About</Link>
            <Link href="/contact" className="text-white hover:text-gray-300">Contact</Link>
            <Link href="/admin" className="text-white hover:text-gray-300">Admin Login</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-screen -mt-16">
          <div className="pl-8 md:pl-16 max-w-6xl">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-8">
              EV Rental
            </h1>
            
            <div className="text-white max-w-2xl">
              <p className="mb-8 text-base md:text-xl">
                A seamless and secure EV rental platform with built-in user verification and payment protection. Get verified, rent effortlessly, and drive with confidence.
              </p>
              
              <div className="flex space-x-4">
                {/* Book Now Button - Modified to use our handler function instead of Link */}
                <button 
                  onClick={handleBooking}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Book Now
                </button>
                
                {/* Login/Logout Button with Loading State */}
                {isLoading ? (
                  <button 
                    className="bg-gray-400 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Loading...
                  </button>
                ) : session ? (
                  <button 
                    onClick={handleLogout} 
                    className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                  >
                    Logout
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)} 
                    className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}