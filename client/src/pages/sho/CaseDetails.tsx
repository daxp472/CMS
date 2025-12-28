import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { caseApi, courtApi } from '../../api';
import type { Case, Court } from '../../types/api.types';
import { CaseState } from '../../types/api.types';

export const SHOCaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [caseDetails, courtsList] = await Promise.all([
        caseApi.getCaseById(id!),
        courtApi.getCourts(),
      ]);
      setCaseData(caseDetails);
      setCourts(courtsList);
      if (courtsList.length > 0) {
        setSelectedCourt(courtsList[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitToCourt = async () => {
    if (!selectedCourt) {
      toast.error('Please select a court');
      return;
    }

    try {
      setIsSubmitting(true);
      await courtApi.submitToCourt(id!, { courtId: selectedCourt });
      toast.success('Case submitted to court successfully');
      fetchData(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit to court');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} retry={fetchData} />;
  if (!caseData) return <ErrorMessage message="Case not found" />;

  const fir = caseData.fir;
  const currentState = caseData.state?.currentState || 'UNKNOWN';
  const canSubmitToCourt = currentState === CaseState.INVESTIGATION_COMPLETED ||
                           currentState === CaseState.CHARGE_SHEET_PREPARED;

  return (
    <>
      <Header
        title={`Case: ${fir?.firNumber || caseData.id.slice(0, 8)}`}
        subtitle={`Status: ${currentState.replace(/_/g, ' ')}`}
      />

      <div className="space-y-6">
        {/* Case Overview */}
        <Card title="Case Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">FIR Number</p>
              <p className="font-semibold text-lg">{fir?.firNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Case State</p>
              <Badge
                variant={
                  currentState === CaseState.FIR_REGISTERED ? 'info' :
                  currentState === CaseState.UNDER_INVESTIGATION ? 'warning' :
                  currentState === CaseState.SUBMITTED_TO_COURT ? 'success' :
                  'default'
                }
              >
                {currentState.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created On</p>
              <p className="font-semibold">
                {new Date(caseData.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </Card>

        {/* FIR Details */}
        {fir && (
          <Card title="FIR Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Sections Applied</p>
                <p className="font-semibold">{fir.sectionsApplied}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Incident Date</p>
                <p className="font-semibold">
                  {new Date(fir.incidentDate).toLocaleString('en-IN')}
                </p>
              </div>
              {fir.policeStation && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Police Station</p>
                  <p className="font-semibold">
                    {fir.policeStation.name}, {fir.policeStation.district}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Assignments */}
        <Card title="Case Assignments">
          {caseData.assignments && caseData.assignments.length > 0 ? (
            <div className="space-y-3">
              {caseData.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    assignment.unassignedAt ? 'bg-gray-100' : 'bg-green-50'
                  }`}
                >
                  <div>
                    <p className="font-medium">{assignment.assignedUser?.name}</p>
                    <p className="text-sm text-gray-500">{assignment.assignmentReason}</p>
                  </div>
                  <Badge variant={assignment.unassignedAt ? 'default' : 'success'}>
                    {assignment.unassignedAt ? 'Past' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No officers assigned" />
          )}
        </Card>

        {/* Investigation Summary */}
        <Card title="Investigation Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {caseData.evidence?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Evidence</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {caseData.witnesses?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Witnesses</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {caseData.accused?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Accused</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {caseData.documents?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
          </div>
        </Card>

        {/* Submit to Court Action */}
        {canSubmitToCourt && (
          <Card title="Submit to Court">
            <div className="space-y-4">
              <p className="text-gray-600">
                Investigation is complete. Select a court to submit this case for prosecution.
              </p>
              <Select
                label="Select Court"
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                options={courts.map(c => ({
                  value: c.id,
                  label: `${c.name} (${c.courtType})`,
                }))}
              />
              <Button
                variant="primary"
                onClick={handleSubmitToCourt}
                isLoading={isSubmitting}
              >
                Submit to Court
              </Button>
            </div>
          </Card>
        )}

        {/* Already Submitted */}
        {currentState === CaseState.SUBMITTED_TO_COURT && (
          <Card>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium text-lg">
                ✓ Case Submitted to Court
              </p>
              <p className="text-green-600 mt-1">
                Awaiting court intake and judge assignment
              </p>
            </div>
          </Card>
        )}

        {/* Back Button */}
        <div className="flex gap-4">
          <Link to="/sho/all-cases">
            <Button variant="secondary">← Back to All Cases</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
