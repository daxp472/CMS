import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { caseApi } from '../../api';
import type { Case } from '../../types/api.types';

export const PoliceCaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await caseApi.getCaseById(id!);
      setCaseData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load case details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} retry={fetchCaseDetails} />;
  if (!caseData) return <ErrorMessage message="Case not found" />;

  const fir = caseData.fir;
  const currentState = caseData.state?.currentState || 'UNKNOWN';

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
                  currentState === 'FIR_REGISTERED' ? 'info' :
                  currentState === 'UNDER_INVESTIGATION' ? 'warning' :
                  currentState === 'SUBMITTED_TO_COURT' ? 'success' :
                  'default'
                }
              >
                {currentState.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created On</p>
              <p className="font-semibold">
                {new Date(caseData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Archived</p>
              <p className="font-semibold">{caseData.isArchived ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </Card>

        {/* FIR Details */}
        {fir && (
          <Card title="FIR Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">FIR Source</p>
                <p className="font-semibold">{fir.firSource}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Incident Date</p>
                <p className="font-semibold">
                  {new Date(fir.incidentDate).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Sections Applied</p>
                <p className="font-semibold">{fir.sectionsApplied}</p>
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
            {fir.firDocumentUrl && (
              <div className="mt-4 pt-4 border-t">
                <a
                  href={fir.firDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  📄 View FIR Document →
                </a>
              </div>
            )}
          </Card>
        )}

        {/* Current Assignments */}
        <Card title="Case Assignments">
          {caseData.assignments && caseData.assignments.length > 0 ? (
            <div className="space-y-3">
              {caseData.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{assignment.assignedUser?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{assignment.assignmentReason}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(assignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No assignments yet" />
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

        {/* Evidence List */}
        {caseData.evidence && caseData.evidence.length > 0 && (
          <Card title="Evidence">
            <div className="space-y-2">
              {caseData.evidence.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Badge variant="info">{ev.category}</Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded: {new Date(ev.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {ev.fileUrl && (
                    <a
                      href={ev.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Witnesses List */}
        {caseData.witnesses && caseData.witnesses.length > 0 && (
          <Card title="Witnesses">
            <div className="space-y-2">
              {caseData.witnesses.map((w) => (
                <div key={w.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{w.name}</p>
                  {w.contact && <p className="text-sm text-gray-500">📞 {w.contact}</p>}
                  {w.address && <p className="text-sm text-gray-500">📍 {w.address}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Accused List */}
        {caseData.accused && caseData.accused.length > 0 && (
          <Card title="Accused">
            <div className="space-y-2">
              {caseData.accused.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <p className="font-medium">{a.name}</p>
                  <Badge
                    variant={
                      a.status === 'ARRESTED' ? 'danger' :
                      a.status === 'ON_BAIL' ? 'warning' :
                      'default'
                    }
                  >
                    {a.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Back Button */}
        <div className="flex gap-4">
          <Link to="/police/my-cases">
            <Button variant="secondary">← Back to My Cases</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
