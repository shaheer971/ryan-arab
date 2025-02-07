import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const WebsiteEditor = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your website changes have been saved successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-satoshi">Website Editor</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homeTitle">Title</Label>
                <Input
                  id="homeTitle"
                  defaultValue="Step into Luxury"
                  placeholder="Enter hero title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeTag">Tag Line</Label>
                <Input
                  id="homeTag"
                  defaultValue="Discover our curated collection of premium footwear"
                  placeholder="Enter tag line"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Background Image</Label>
                <div className="flex gap-4 items-start">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772"
                    alt="Current hero"
                    className="w-40 h-24 object-cover rounded-md"
                  />
                  <Input id="heroImage" type="file" accept="image/*" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Men's Collection", "Women's Collection", "Kids' Collection"].map(
                (category, index) => (
                  <div key={index} className="space-y-4 pb-4 border-b last:border-0">
                    <div className="space-y-2">
                      <Label htmlFor={`category${index}Title`}>
                        Category {index + 1} Title
                      </Label>
                      <Input
                        id={`category${index}Title`}
                        defaultValue={category}
                        placeholder="Enter category title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`category${index}Image`}>
                        Category Image
                      </Label>
                      <div className="flex gap-4 items-start">
                        <img
                          src={`https://images.unsplash.com/photo-${
                            index === 0
                              ? "1491553895911-0055eca6402d"
                              : index === 1
                              ? "1543163521-1bf539c55dd2"
                              : "1514989940723-e8e51635b782"
                          }`}
                          alt={category}
                          className="w-40 h-24 object-cover rounded-md"
                        />
                        <Input
                          id={`category${index}Image`}
                          type="file"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Page Title</Label>
                <Input
                  id="aboutTitle"
                  defaultValue="Our Story"
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutHeroImage">Hero Image</Label>
                <div className="flex gap-4 items-start">
                  <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
                    alt="Current about hero"
                    className="w-40 h-24 object-cover rounded-md"
                  />
                  <Input id="aboutHeroImage" type="file" accept="image/*" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutContent">Main Content</Label>
                <Textarea
                  id="aboutContent"
                  defaultValue="Founded with a passion for exceptional footwear, our journey began in a small workshop where every stitch was crafted with precision and care. Today, we continue to honor that tradition while embracing innovation and contemporary design."
                  placeholder="Enter main content"
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactTitle">Page Title</Label>
                <Input
                  id="contactTitle"
                  defaultValue="Get in Touch"
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 Luxury Lane, Fashion District"
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue="contact@luxuryshoes.com"
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  defaultValue="+1 (555) 123-4567"
                  placeholder="Enter phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Textarea
                  id="businessHours"
                  defaultValue="Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 4:00 PM
Sunday: Closed"
                  placeholder="Enter business hours"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteEditor;