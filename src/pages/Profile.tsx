
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Save, User } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  age: z.string(),
  location: z.string().optional(),
  hobbies: z.string(),
  about: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      age: '',
      location: '',
      hobbies: '',
      about: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProfileData(data);

        form.reset({
          name: data.name,
          email: data.email,
          age: data.age,
          location: data.location,
          hobbies: data.hobbies,
          about: data.about,
        });
      } catch (err) {
        toast({
          title: "Error loading profile",
          description: "Please login again.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Here you would typically update the profile on a backend
      console.log("Profile update data:", data);

      setTimeout(() => {
        toast({
          title: "Profile updated!",
          description: "Your profile information has been saved.",
        });
        setIsEditing(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const hobbiesList = profileData?.hobbies?.split(',').map(hobby => hobby.trim()) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="page-title mb-6">My <span className="text-primary">Profile</span></h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profileData?.avatarUrl} alt={profileData?.name} />
                  <AvatarFallback>
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-semibold">{profileData?.name}</h2>
                <p className="text-muted-foreground mb-4">{profileData?.location}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {hobbiesList.slice(0, 3).map((hobby, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">{hobby}</Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  Member since {profileData?.joinDate}
                </p>

                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2" size={16} />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="about">About Me</TabsTrigger>
                <TabsTrigger value="edit" disabled={!isEditing}>Edit Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Bio</h3>
                        <p className="mt-1 text-muted-foreground">{profileData?.about}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Interests & Hobbies</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {hobbiesList.map((hobby, index) => (
                            <Badge key={index} variant="outline" className="text-sm">{hobby}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <dl className="mt-1 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm text-muted-foreground">Age</dt>
                            <dd className="text-base">{profileData?.age}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Location</dt>
                            <dd className="text-base">
                              {profileData?.address ? `${profileData.address.slice(0, 40)}...` : ""}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Email</dt>
                            <dd className="text-base">{profileData?.email}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Your Profile</CardTitle>
                    <CardDescription>
                      Update your personal information and interests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="text-base" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" className="text-base" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-base" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City, State"
                                  {...field}
                                  value={field.value || ''}
                                  className="text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hobbies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interests & Hobbies</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="text-base"
                                />
                              </FormControl>
                              <FormDescription>
                                Enter your hobbies separated by commas (e.g., Reading, Cooking, Gardening)
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
                                  {...field}
                                  className="text-base min-h-[120px]"
                                />
                              </FormControl>
                              <FormDescription>
                                Tell us about yourself, your experiences, and what you're looking for in new friends
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : (
                              <>
                                <Save className="mr-2" size={16} />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
