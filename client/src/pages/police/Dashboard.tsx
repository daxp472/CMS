import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { caseApi } from '../../api';
import type { Case } from '../../types/api.types';
import { CaseState } from '../../types/api.types';

export const PoliceDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await caseApi.getMyCases();
      setCases(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} retry={fetchMyCases} />;

  // Calculate stats
  const totalCases = cases.length;
  const underInvestigation = cases.filter(
    c => c.state?.currentState === CaseState.UNDER_INVESTIGATION
  ).length;
  const submittedToCourt = cases.filter(
    c => c.state?.currentState === CaseState.SUBMITTED_TO_COURT ||
         c.state?.currentState === CaseState.COURT_ACCEPTED
  ).length;

  return (
    <>
      <Header
        title="Police Dashboard"
        subtitle="Manage FIRs and investigations"
        action={
          <Link to="/police/create-fir">
            <Button variant="primary">+ Create FIR</Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{totalCases}</p>
            <p className="text-gray-600 mt-2">Total Cases</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-yellow-600">{underInvestigation}</p>
            <p className="text-gray-600 mt-2">Under Investigation</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{submittedToCourt}</p>
            <p className="text-gray-600 mt-2">In Court</p>
          </div>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card title="Recent Cases">
        {cases.length === 0 ? (
          <EmptyState
            message="No cases assigned yet"
            action={
              <Link to="/police/create-fir">
                <Button variant="primary">Create Your First FIR</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {cases.slice(0, 5).map((c) => {
              const state = c.state?.currentState || 'UNKNOWN';
              const firNumber = c.fir?.firNumber || c.id.slice(0, 8);
              
              return (
                <Link
                  key={c.id}
                  to={`/police/cases/${c.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">FIR: {firNumber}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {c.fir?.sectionsApplied || 'No sections specified'}
                      </p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                        {c.fir?.policeStation && (
                          <>
                            <span>•</span>
                            <span>🏢 {c.fir.policeStation.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        state === CaseState.FIR_REGISTERED ? 'info' :
                        state === CaseState.UNDER_INVESTIGATION ? 'warning' :
                        state === CaseState.SUBMITTED_TO_COURT ? 'success' :
                        'default'
                      }
                    >
                      {state.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </Link>
              );
            })}
            
            {cases.length > 5 && (
              <Link 
                to="/police/my-cases" 
                className="block text-center text-blue-600 hover:underline mt-4 py-2"
              >
                View All {cases.length} Cases →
              </Link>
            )}
          </div>
        )}
      </Card>
    </>
  );
};
