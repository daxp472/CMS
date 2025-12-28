import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { caseApi } from '../../api';
import type { Case } from '../../types/api.types';
import { CaseState } from '../../types/api.types';

export const JudgeDashboard: React.FC = () => {
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
      // For judge, get all cases (those accepted by court)
      const data = await caseApi.getAllCases();
      setCases(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} retry={fetchMyCases} />;

  // Filter cases by current state
  const courtAcceptedCases = cases.filter(
    (c) => c.state?.currentState === CaseState.COURT_ACCEPTED
  );
  const trialCases = cases.filter(
    (c) => c.state?.currentState === CaseState.TRIAL_ONGOING
  );
  const judgmentReservedCases = cases.filter(
    (c) => c.state?.currentState === CaseState.JUDGMENT_RESERVED
  );
  const disposedCases = cases.filter(
    (c) => c.state?.currentState === CaseState.DISPOSED
  );

  const getBadgeVariant = (state: string) => {
    switch (state) {
      case CaseState.COURT_ACCEPTED:
        return 'info';
      case CaseState.TRIAL_ONGOING:
        return 'warning';
      case CaseState.JUDGMENT_RESERVED:
        return 'default';
      case CaseState.DISPOSED:
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Header
        title="Judge Dashboard"
        subtitle="Review cases and record court actions"
        action={
          <Link to="/judge/cases">
            <Button variant="primary">View All Cases</Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{courtAcceptedCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Ready for Trial</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{trialCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Trial Ongoing</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{judgmentReservedCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Judgment Reserved</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{disposedCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Disposed</p>
          </div>
        </Card>
      </div>

      {/* Cases Needing Action (Court Accepted - need to start trial) */}
      {courtAcceptedCases.length > 0 && (
        <Card title="Cases Ready for Trial" className="mb-6">
          <div className="space-y-4">
            {courtAcceptedCases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/judge/cases/${c.id}`}
                className="block p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {c.fir?.firNumber || `Case ${c.id.slice(0, 8)}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sections: {c.fir?.sectionsApplied || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Accepted: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Badge variant="info">Schedule Hearing</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Ongoing Trial Cases */}
      <Card title="Ongoing Trial Cases">
        {trialCases.length === 0 ? (
          <EmptyState
            title="No Ongoing Trials"
            message="Cases with ongoing trials will appear here"
          />
        ) : (
          <div className="space-y-3">
            {trialCases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/judge/cases/${c.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{c.fir?.firNumber || c.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {c.fir?.sectionsApplied || 'N/A'}
                  </p>
                </div>
                <Badge variant={getBadgeVariant(c.state?.currentState || '')}>
                  {(c.state?.currentState || 'UNKNOWN').replace(/_/g, ' ')}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};
