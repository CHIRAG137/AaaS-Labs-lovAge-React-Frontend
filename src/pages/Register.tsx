
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, MapPin, Map } from 'lucide-react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

// API base URL - update this to match your server URL
const API_URL = 'http://localhost:5000/api';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 60, {
    message: "Please enter a valid age (60+)",
  }),
  hobbies: z.string().min(3, { message: "Please share some of your hobbies or interests" }),
  about: z.string(),
  preferredCommunication: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one communication preference",
  }),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface LocationError {
  type: string;
  message: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ description: string, place_id: string }>>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const communicationOptions = [
    { id: "video", label: "Video Calls" },
    { id: "messaging", label: "Text Messaging" },
    { id: "group", label: "Group Activities" },
  ];

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      hobbies: '',
      about: '',
      preferredCommunication: [],
      address: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  // Function to get current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError({
        type: 'unsupported',
        message: 'Geolocation is not supported by your browser'
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
        
        // Try to get address from coordinates using a reverse geocoding service
        try {
          // In a production app, you would use Google's Geocoding API with your API key
          // For this example, we'll simulate a success response
          form.setValue('address', `Location captured (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          toast({
            title: "Location captured",
            description: "Your current location has been successfully captured.",
          });
        } catch (error) {
          console.error("Error getting address from coordinates:", error);
          form.setValue('address', `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unknown error occurred";
        
        switch(error.code) {
          case 1:
            errorMessage = "Permission to access location was denied";
            break;
          case 2:
            errorMessage = "Position is unavailable";
            break;
          case 3:
            errorMessage = "Location request timed out";
            break;
        }
        
        setLocationError({
          type: 'error',
          message: errorMessage
        });
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Function to handle address input and fetch suggestions
  const handleAddressInput = (value: string) => {
    form.setValue('address', value);
    
    if (value.length > 3) {
      setIsLoadingSuggestions(true);
      
      // In a real app, you would call the Google Places API here
      // For this example, we'll simulate API results
      setTimeout(() => {
        if (value.includes("oak")) {
          setAddressSuggestions([
            { description: "Oak Street, San Francisco, CA", place_id: "1" },
            { description: "Oakland, CA, USA", place_id: "2" },
            { description: "Oak Park, IL, USA", place_id: "3" }
          ]);
        } else if (value.includes("pine")) {
          setAddressSuggestions([
            { description: "Pine Street, New York, NY", place_id: "4" },
            { description: "Pinedale, WY, USA", place_id: "5" }
          ]);
        } else {
          setAddressSuggestions([]);
        }
        setIsLoadingSuggestions(false);
      }, 500);
    } else {
      setAddressSuggestions([]);
    }
  };

  // Function to select an address from suggestions
  const selectAddress = (address: string) => {
    form.setValue('address', address);
    setAddressSuggestions([]);
    
    // In a real app, you would use the Google Places API to get latitude and longitude
    // For this example, we'll set placeholder values
    form.setValue('latitude', 37.7749);
    form.setValue('longitude', -122.4194);
    
    toast({
      title: "Address selected",
      description: "Your selected address has been set.",
    });
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // API call to register user
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        age: data.age,
        hobbies: data.hobbies,
        about: data.about,
        preferredCommunication: data.preferredCommunication,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      
      // Handle successful registration
      toast({
        title: "Registration successful!",
        description: "Welcome to GoldenChat! Your profile has been created.",
      });
      
      // Store user data or token in localStorage if needed
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to profile page
      navigate('/profile');
    } catch (error: any) {
      // Handle registration errors
      console.error("Registration error:", error);
      
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    const fieldsToValidate = step === 1 
      ? ['name', 'email', 'password', 'confirmPassword', 'age', 'address']
      : ['hobbies', 'about', 'preferredCommunication'];
      
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        setStep(step + 1);
      }
    });
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>
              {step === 1 ? "Enter your details to get started" : 
               step === 2 ? "Tell us a little about yourself" : 
               "Complete your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} className="text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="youremail@example.com" {...field} type="email" className="text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" {...field} type="password" className="text-base" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" {...field} type="password" className="text-base" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your age" {...field} className="text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location section moved to step 1 */}
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-medium">Your Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Sharing your location helps us connect you with seniors in your area
                      </p>
                      
                      <div className="flex items-center justify-between gap-2">
                        <Button 
                          type="button" 
                          onClick={getCurrentLocation} 
                          disabled={isLoadingLocation} 
                          className="flex-1"
                          variant="outline"
                        >
                          <MapPin className="mr-2" size={18} />
                          {isLoadingLocation ? "Getting Location..." : "Use Current Location"}
                        </Button>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          or
                        </div>
                        
                        <Button 
                          type="button" 
                          onClick={() => {
                            form.setValue('address', '');
                            setAddressSuggestions([]);
                          }} 
                          className="flex-1"
                          variant="outline"
                        >
                          <Map className="mr-2" size={18} />
                          Enter Address
                        </Button>
                      </div>
                      
                      {locationError && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{locationError.message}</AlertDescription>
                        </Alert>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="Start typing your address..." 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleAddressInput(e.target.value);
                                  }}
                                  className="text-base" 
                                />
                                {isLoadingSuggestions && (
                                  <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter your address or use your current location
                            </FormDescription>
                            <FormMessage />
                            
                            {addressSuggestions.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                                {addressSuggestions.map((suggestion) => (
                                  <div 
                                    key={suggestion.place_id}
                                    className="px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                                    onClick={() => selectAddress(suggestion.description)}
                                  >
                                    {suggestion.description}
                                  </div>
                                ))}
                              </div>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="hobbies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interests & Hobbies</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Gardening, Reading, Cooking, etc." 
                              {...field} 
                              className="text-base" 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your hobbies separated by commas. This helps us find friends with similar interests.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Me</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a little about yourself..." 
                              {...field} 
                              className="text-base resize-none min-h-[120px]" 
                            />
                          </FormControl>
                          <FormDescription>
                            Share something about your life experiences or what you're looking for in new friends.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredCommunication"
                      render={() => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel>How do you prefer to communicate?</FormLabel>
                            <FormDescription>
                              Select all that apply
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {communicationOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="preferredCommunication"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-base font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <div className="flex justify-between gap-4 pt-4">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  
                  {step < 2 ? (
                    <Button type="button" onClick={nextStep} className="ml-auto">
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading} className="ml-auto">
                      {isLoading ? "Creating Account..." : (
                        <>
                          <UserPlus className="mr-2" size={18} />
                          Create Account
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
