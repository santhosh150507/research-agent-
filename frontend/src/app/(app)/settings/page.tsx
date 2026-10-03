"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Settings, User, BookOpen, Target, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
  });

  const [name, setName] = useState("");
  const [interests, setInterests] = useState("");
  const [domains, setDomains] = useState("");
  const [methods, setMethods] = useState("");
  
  useEffect(() => {
    if (data) {
      setName(data.name);
      setInterests(data.interests.join(", "));
      setDomains(data.preferred_domains.join(", "));
      setMethods(data.favorite_methods.join(", "));
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (req: any) => api.updateProfile(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      name,
      interests: interests.split(",").map(s => s.trim()).filter(Boolean),
      preferred_domains: domains.split(",").map(s => s.trim()).filter(Boolean),
      favorite_methods: methods.split(",").map(s => s.trim()).filter(Boolean),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your research profile and preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Research Profile</CardTitle>
            <CardDescription>Personalize your agent&apos;s recommendations and focus areas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="flex items-center gap-2">
                <Target className="h-4 w-4" /> Core Interests (comma-separated)
              </Label>
              <Input id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. LLMs, Reinforcement Learning, Alignment" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="domains" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Preferred Domains (comma-separated)
              </Label>
              <Input id="domains" value={domains} onChange={e => setDomains(e.target.value)} placeholder="e.g. Computer Science, Neuroscience" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="methods" className="flex items-center gap-2">
                <Network className="h-4 w-4" /> Favorite Methods (comma-separated)
              </Label>
              <Input id="methods" value={methods} onChange={e => setMethods(e.target.value)} placeholder="e.g. Transformers, CNNs" />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
