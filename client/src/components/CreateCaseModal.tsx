import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { insertCaseSchema } from "../shared/schema";
import type { z } from "zod";

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof insertCaseSchema>) => void;
}

export function CreateCaseModal({ isOpen, onClose, onSubmit }: CreateCaseModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState<"active" | "resolved" | "review">("active");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<"male" | "female" | "other">("male");
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Array<{ url: string; type: string; name: string; size: number }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      specialty,
      status,
      priority,
      patientAge,
      patientGender,
      tags,
      attachments
    });
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload these files to a storage service
    // and get back URLs. This is just a mock implementation.
    const newAttachments = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      size: file.size
    }));

    setAttachments([...attachments, ...newAttachments]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter case title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the case"
              required
              className="min-h-[150px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Specialty</label>
            <Input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Enter medical specialty"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "resolved" | "review")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="review">Under Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "normal" | "high" | "urgent")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Patient Age</label>
              <Input
                type="text"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Patient Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as "male" | "female" | "other")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attachments</label>
            <Input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
            />
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {attachments.map((file) => (
                  <div key={file.name} className="text-sm text-muted-foreground">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Case
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
