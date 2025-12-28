import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { caseApi } from '../../api';
import type { Case } from '../../types/api.types';
import { CaseState } from '../../types/api.types';

export const SHODashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await caseApi.getAllCases();
      setCases(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} retry={fetchCases} />;

  // Calculate stats
  const totalCases = cases.length;
  const pendingReview = cases.filter(
    c => c.state?.currentState === CaseState.INVESTIGATION_COMPLETED
  ).length;
  const submittedToCourt = cases.filter(
    c => c.state?.currentState === CaseState.SUBMITTED_TO_COURT
  ).length;

  // Cases needing action
  const casesNeedingAction = cases.filter(
    c => c.state?.currentState === CaseState.INVESTIGATION_COMPLETED ||
         c.state?.currentState === CaseState.FIR_REGISTERED
  );

  return (
    <>
      <Header
        title="SHO Dashboard"
        subtitle="Station House Officer - Case Management"
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
            <p className="text-4xl font-bold text-orange-600">{pendingReview}</p>
            <p className="text-gray-600 mt-2">Pending Review</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{submittedToCourt}</p>
            <p className="text-gray-600 mt-2">Submitted to Court</p>
          </div>
        </Card>
      </div>

      {/* Cases Needing Action */}
      {casesNeedingAction.length > 0 && (
        <Card title="⚠️ Cases Needing Action">
          <div className="space-y-3">
            {casesNeedingAction.slice(0, 5).map((c) => {
              const state = c.state?.currentState || 'UNKNOWN';
              return (
                <Link
                  key={c.id}
                  to={`/sho/cases/${c.id}`}
                  className="block p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{c.fir?.firNumber || c.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{c.fir?.sectionsApplied}</p>
                    </div>
                    <Badge variant="warning">{state.replace(/_/g, ' ')}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Cases */}
      <Card title="Recent Cases" className="mt-6">
        {cases.length === 0 ? (
          <EmptyState message="No cases in station yet" />
        ) : (
          <div className="space-y-3">
            {cases.slice(0, 5).map((c) => {
              const state = c.state?.currentState || 'UNKNOWN';
              return (
                <Link
                  key={c.id}
                  to={`/sho/cases/${c.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{c.fir?.firNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
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
            <Link to="/sho/all-cases" className="block text-center text-blue-600 hover:underline py-2">
              View All Cases →
            </Link>
          </div>
        )}
      </Card>
    </>
  );
};
