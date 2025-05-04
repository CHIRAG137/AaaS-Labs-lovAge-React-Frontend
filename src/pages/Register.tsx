
import React, { useState } from 'react';
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
import { UserPlus } from 'lucide-react';

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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
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
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Here you would typically register with a backend
      // For now, we'll simulate a successful registration
      console.log("Registration data:", data);
      
      setTimeout(() => {
        toast({
          title: "Registration successful!",
          description: "Welcome to GoldenChat! Your profile has been created.",
        });
        navigate('/profile');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    const fieldsToValidate = step === 1 
      ? ['name', 'email', 'password', 'confirmPassword', 'age']
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
              {step === 1 ? "Enter your details to get started" : "Tell us a little about yourself"}
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
