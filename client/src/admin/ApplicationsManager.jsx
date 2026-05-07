import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const STATUS_OPTIONS = ["new", "in-review", "approved", "rejected"];

export default function ApplicationsManager() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    fetch(`${apiBaseUrl}/api/applications`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load applications");
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Unable to load applications");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const getBadgeVariant = (status) => {
    if (status === "approved") return "success";
    if (status === "rejected") return "destructive";
    return "default";
  };

  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    return (
      (app.applicantName || "").toLowerCase().includes(query) ||
      (app.applicantEmail || "").toLowerCase().includes(query) ||
      (app.applicantPhone || "").toLowerCase().includes(query) ||
      (app.status || "").toLowerCase().includes(query)
    );
  });

  const toggleExpand = (applicationId) => {
    setExpandedId(expandedId === applicationId ? null : applicationId);
    setSelectedStatus("new");
  };

  const handleStatusUpdate = (applicationId) => {
    setUpdating(true);

    fetch(`${apiBaseUrl}/api/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update status");
        return response.json();
      })
      .then((updated) => {
        setApplications((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
      })
      .catch((err) => {
        setError(err.message || "Unable to update status");
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const handleDelete = (applicationId) => {
    if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      return;
    }

    setDeleting(applicationId);
    fetch(`${apiBaseUrl}/api/applications/${applicationId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete application");
        return response.json();
      })
      .then(() => {
        setApplications((prev) => prev.filter((app) => app._id !== applicationId));
        if (expandedId === applicationId) {
          setExpandedId(null);
        }
      })
      .catch((err) => {
        setError(err.message || "Unable to delete application");
      })
      .finally(() => {
        setDeleting(null);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Applications</h2>
        <p className="text-sm text-slate-600">Review incoming applications and update their status.</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base">Application submissions</CardTitle>
              <CardDescription>Latest form submissions from the Apply Now page.</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, phone, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                style={{ color: '#0f172a' }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading applications...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : applications.length === 0 ? (
            <p className="text-sm text-slate-500">No applications yet.</p>
          ) : filteredApplications.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No applications match your search.</p>
          ) : (
            <div className="space-y-3">
              {searchQuery && (
                <p className="text-xs text-slate-500">
                  Showing {filteredApplications.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
                </p>
              )}
              <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Applicant name</th>
                    <th className="px-4 py-3">Phone number</th>
                    <th className="px-4 py-3">Submission date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => {
                    const isExpanded = expandedId === application._id;
                    return (
                      <>
                        <tr key={application._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-900">{application.applicantName || "-"}</td>
                          <td className="px-4 py-3 text-slate-600">{application.applicantPhone || "-"}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {application.createdAt
                              ? new Date(application.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={getBadgeVariant(application.status)}>{application.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleExpand(application._id)}
                              >
                                {isExpanded ? "Hide" : "View"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(application._id)}
                                disabled={deleting === application._id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                              >
                                {deleting === application._id ? (
                                  <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                                ) : (
                                  <i className="fa-solid fa-trash-can text-xs"></i>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${application._id}-details`}>
                            <td colSpan="5" className="bg-slate-50/50 px-4 py-6">
                              <div className="max-w-4xl mx-auto space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs text-slate-500">Submitted</p>
                                    <p className="font-medium text-slate-900">
                                      {application.createdAt
                                        ? new Date(application.createdAt).toLocaleString()
                                        : "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">Status</p>
                                    <div className="flex items-center gap-2">
                                      <select
                                        className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                                        value={selectedStatus}
                                        onChange={(event) => setSelectedStatus(event.target.value)}
                                      >
                                        {STATUS_OPTIONS.map((status) => (
                                          <option key={status} value={status}>
                                            {status}
                                          </option>
                                        ))}
                                      </select>
                                      <Button size="sm" onClick={() => handleStatusUpdate(application._id)} disabled={updating}>
                                        {updating ? "Updating..." : "Update"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Dynamic Fields Section */}
                                {application.fields && application.fields.length > 0 && (
                                  <>
                                    <Separator />
                                    <div className="space-y-3">
                                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Application Details</p>
                                      <div className="grid gap-3 md:grid-cols-2">
                                        {application.fields.map((field) => (
                                          <div key={field.key}>
                                            <p className="text-xs text-slate-500">{field.label}</p>
                                            <p className="font-medium text-slate-900">
                                              {field.value || "-"}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}

                                <Separator />

                                {/* Documents Section */}
                                <div className="space-y-3">
                                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Documents</p>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {application.documents && application.documents.length > 0 ? (
                                      application.documents.map((doc) => (
                                        <div key={doc.key} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2">
                                          <div>
                                            <p className="text-xs text-slate-500">{doc.label}</p>
                                            <p className="text-sm font-medium text-slate-800">
                                              {doc.originalName || "Not provided"}
                                            </p>
                                          </div>
                                          {doc.filename ? (
                                            <div className="flex items-center gap-3 text-xs">
                                              <a
                                                href={`${apiBaseUrl}/uploads/applications/${doc.filename}`}
                                                className="text-slate-700 underline hover:text-slate-900"
                                                target="_blank"
                                                rel="noreferrer"
                                              >
                                                View
                                              </a>
                                              <button
                                                onClick={async () => {
                                                  try {
                                                    const response = await fetch(`${apiBaseUrl}/uploads/applications/${doc.filename}`);
                                                    if (!response.ok) throw new Error('Download failed');
                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = doc.originalName || doc.filename;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                    window.URL.revokeObjectURL(url);
                                                  } catch (error) {
                                                    console.error('Download error:', error);
                                                    // Fallback: open in new tab
                                                    window.open(`${apiBaseUrl}/uploads/applications/${doc.filename}`, '_blank');
                                                  }
                                                }}
                                                className="text-slate-700 underline hover:text-slate-900"
                                              >
                                                Download
                                              </button>
                                            </div>
                                          ) : (
                                            <span className="text-xs text-slate-400">Not uploaded</span>
                                          )}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="col-span-2 py-6 text-center text-sm text-slate-500">
                                        No documents uploaded
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
