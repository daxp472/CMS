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

export const CourtDashboard: React.FC = () => {
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

  // Filter cases by current state
  const incomingCases = cases.filter(
    (c) => c.state?.currentState === CaseState.SUBMITTED_TO_COURT
  );
  const acceptedCases = cases.filter(
    (c) => c.state?.currentState === CaseState.COURT_ACCEPTED
  );
  const trialCases = cases.filter(
    (c) => c.state?.currentState === CaseState.TRIAL_ONGOING
  );

  return (
    <>
      <Header
        title="Court Clerk Dashboard"
        subtitle="Manage incoming cases and court proceedings"
        action={
          <Link to="/court/incoming-cases">
            <Button variant="primary">View Incoming Cases</Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{incomingCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Pending Intake</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{acceptedCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Accepted</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{trialCases.length}</p>
            <p className="text-sm text-gray-600 mt-2">In Trial</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{cases.length}</p>
            <p className="text-sm text-gray-600 mt-2">Total Cases</p>
          </div>
        </Card>
      </div>

      {/* Cases Needing Action */}
      {incomingCases.length > 0 && (
        <Card title="Cases Needing Intake" className="mb-6">
          <div className="space-y-4">
            {incomingCases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/court/cases/${c.id}`}
                className="block p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
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
                      Submitted: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Badge variant="warning">Accept Case</Badge>
                </div>
              </Link>
            ))}
            {incomingCases.length > 5 && (
              <Link
                to="/court/incoming-cases"
                className="block text-center text-blue-600 hover:underline font-medium"
              >
                View All {incomingCases.length} Incoming Cases →
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Recent Accepted Cases */}
      <Card title="Recently Accepted Cases">
        {acceptedCases.length === 0 ? (
          <EmptyState
            title="No Accepted Cases"
            message="Cases you accept will appear here"
          />
        ) : (
          <div className="space-y-3">
            {acceptedCases.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/court/cases/${c.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{c.fir?.firNumber || c.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {c.fir?.sectionsApplied || 'N/A'}
                  </p>
                </div>
                <Badge variant="success">Accepted</Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};
