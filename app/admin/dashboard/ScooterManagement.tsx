import React, { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Scooter, ScooterFormData, emptyScooterForm } from './ScooterTypes';
import ScooterForm from './ScooterForm';
import Notification from './Notification';

type ScooterManagementProps = {
  supabase: SupabaseClient;
};

const ScooterManagement: React.FC<ScooterManagementProps> = ({ supabase }) => {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showScooterForm, setShowScooterForm] = useState(false);
  const [editingScooter, setEditingScooter] = useState<Scooter | null>(null);
  const [formData, setFormData] = useState<ScooterFormData>(emptyScooterForm);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  
  // Fetch initial data with polling instead of realtime
  useEffect(() => {
    // Check if supabase is defined before using it
    if (!supabase) {
      console.error('Supabase client is not initialized');
      showNotification('Database connection error', 'error');
      setLoading(false);
      return;
    }
    
    fetchScooters();
    
    // Set up polling as a more reliable alternative to realtime
    const pollingInterval = setInterval(() => {
      console.log('Polling for scooter changes...');
      fetchScooters();
    }, 5000); // Poll every 5 seconds
    
    return () => {
      clearInterval(pollingInterval);
    };
  }, [supabase]);
  
  const fetchScooters = async () => {
    // Additional safety check
    if (!supabase) {
      console.error('Supabase client is not initialized');
      showNotification('Database connection error', 'error');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching scooters from database...');
      
      const { data, error } = await supabase
        .from('scooters')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase fetch error details:', error);
        throw error;
      }
      
      console.log('Scooters fetched successfully:', data);
      setScooters(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching scooters:', error);
      showNotification(`Failed to load scooters: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleScooterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleScooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if supabase is initialized
    if (!supabase) {
      showNotification('Database connection error', 'error');
      return;
    }
    
    // Validate form data
    const requiredFields = ['name', 'model', 'pricePerHour', 'location', 'owner'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ScooterFormData]);
    
    if (missingFields.length > 0) {
      showNotification(`Please fill in required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }
    
    try {
      console.log('Submitting scooter data:', formData); // Log the data being submitted
      
      if (editingScooter) {
        // Update existing scooter
        const { data, error } = await supabase
          .from('scooters')
          .update(formData)
          .eq('id', editingScooter.id)
          .select();
          
        if (error) {
          console.error('Supabase update error details:', error);
          throw error;
        }
        
        console.log('Scooter updated successfully:', data);
        
        // Update local state immediately for better UX
        setScooters(prevScooters => 
          prevScooters.map(scooter => 
            scooter.id === editingScooter.id ? { ...scooter, ...formData, id: editingScooter.id } : scooter
          )
        );
        
        showNotification('Scooter updated successfully', 'success');
        setEditingScooter(null);
      } else {
        // Add new scooter
        const { data, error } = await supabase
          .from('scooters')
          .insert([formData])
          .select();
          
        if (error) {
          console.error('Supabase insert error details:', error);
          throw error;
        }
        
        console.log('New scooter added successfully:', data);
        
        // Add to local state immediately for better UX
        if (data && data.length > 0) {
          setScooters(prevScooters => [data[0], ...prevScooters]);
        }
        
        showNotification('Scooter added successfully', 'success');
      }
      
      // Reset form and close modal
      setFormData(emptyScooterForm);
      setShowScooterForm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = JSON.stringify(error, null, 2);
      
      console.error('Error submitting scooter:', { message: errorMessage, details: errorDetails });
      
      showNotification(
        `Failed to ${editingScooter ? 'update' : 'add'} scooter. Error: ${errorMessage}`, 
        'error'
      );
    }
  };
  
  const handleEditScooter = (scooter: Scooter) => {
    setEditingScooter(scooter);
    setFormData({
      name: scooter.name,
      model: scooter.model,
      imageUrl: scooter.imageUrl || '',
      pricePerHour: scooter.pricePerHour,
      maxSpeed: scooter.maxSpeed,
      location: scooter.location,
      mileage: scooter.mileage,
      support: scooter.support,
      owner: scooter.owner,
      available: scooter.available,
      rating: scooter.rating
    });
    setShowScooterForm(true);
  };
  
  const handleDeleteScooter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scooter?')) {
      return;
    }
    
    // Check if supabase is initialized
    if (!supabase) {
      showNotification('Database connection error', 'error');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('scooters')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Supabase delete error details:', error);
        throw error;
      }
      
      // Update local state immediately for better UX
      setScooters(prevScooters => prevScooters.filter(scooter => scooter.id !== id));
      
      showNotification('Scooter deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error deleting scooter:', error);
      showNotification(`Failed to delete scooter: ${errorMessage}`, 'error');
    }
  };
  
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  // Component for the dashboard cards
  const DashboardCard = ({ title, value, icon }: { title: string, value: string | number, icon: string }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <i className={icon}></i>
        </div>
        <div className="ml-4">
          <h3 className="text-sm text-gray-500 uppercase font-semibold">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    
      {showScooterForm && (
        <ScooterForm
          scooterData={formData}
          isEditing={!!editingScooter}
          onCancel={() => {
            setShowScooterForm(false);
            setEditingScooter(null);
            setFormData(emptyScooterForm);
          }}
          onSubmit={handleScooterSubmit}
          onChange={handleScooterChange}
        />
      )}
      
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Scooters" 
          value={scooters.length} 
          icon="fas fa-motorcycle" 
        />
        <DashboardCard 
          title="Available Scooters" 
          value={scooters.filter(s => s.available === 1).length} 
          icon="fas fa-check-circle" 
        />
        <DashboardCard 
          title="Unavailable Scooters" 
          value={scooters.filter(s => s.available === 0).length} 
          icon="fas fa-times-circle" 
        />
      </div>
      
      {/* Manage Scooters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Scooters</h2>
          <button
            onClick={() => {
              setEditingScooter(null);
              setFormData(emptyScooterForm);
              setShowScooterForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add New Scooter
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <p>Loading scooters...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scooter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scooters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No scooters found. Add your first scooter to get started.
                    </td>
                  </tr>
                ) : (
                  scooters.map((scooter) => (
                    <tr key={scooter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {scooter.imageUrl ? (
                              <img
                                src={scooter.imageUrl}
                                alt={scooter.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">No img</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{scooter.name}</div>
                            <div className="text-sm text-gray-500">{scooter.model}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{scooter.location}</div>
                        <div className="text-sm text-gray-500">
                          Max: {scooter.maxSpeed} • Mileage: {scooter.mileage}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${scooter.pricePerHour}/hr</div>
                        <div className="text-sm text-gray-500">Rating: {scooter.rating}/5</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            scooter.available === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {scooter.available === 1 ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditScooter(scooter)}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteScooter(scooter.id)}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ScooterManagement;