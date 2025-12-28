import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/common/FileUpload';
import { firApi } from '../../api';

export const CreateFIR: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [firDocument, setFirDocument] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    incidentDate: '',
    sectionsApplied: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const fir = await firApi.createFIR(
        formData.incidentDate,
        formData.sectionsApplied,
        firDocument || undefined
      );
      toast.success('FIR created successfully');
      navigate(`/police/cases/${fir.caseId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create FIR');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header
        title="Create FIR"
        subtitle="Register a new First Information Report"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Incident Date & Time"
              type="datetime-local"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Sections Applied"
              name="sectionsApplied"
              value={formData.sectionsApplied}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter IPC sections applied (e.g., Section 302, 307 IPC)"
            />
          </div>

          <FileUpload
            label="FIR Document (Optional - PDF/JPG/PNG)"
            accept=".pdf,.jpg,.jpeg,.png"
            onFileSelect={setFirDocument}
            currentFile={firDocument}
            maxSize={20}
          />

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Create FIR
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/police/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};
