import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FileText, CheckCircle, Clock, Download, ExternalLink, Upload, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function FormsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<any[]>([]);
  const [allRequiredCompleted, setAllRequiredCompleted] = useState(false);

  // Fetch forms and submission status
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      if (!userId) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/forms/submissions?userId=${userId}`);
      const data = await response.json();
      
      setForms(data.forms || []);
      setAllRequiredCompleted(data.allRequiredCompleted || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const [documents, setDocuments] = useState<any[]>([]);

  const handleFormClick = (form: any) => {
    if (form.status === "completed") {
      // In production: trigger download
      console.log("Download form:", form.id);
      alert(`Downloading ${form.title}...`);
    } else {
      setSelectedForm(form);
      setShowFormModal(true);
    }
  };

  const handleFormSubmit = async () => {
    setSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      const response = await fetch('/api/forms/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          formId: selectedForm.id,
          formData: {}, // In real app, collect actual form data
          signature: 'User Signature' // In real app, use actual signature
        })
      });

      if (response.ok) {
        const formTitle = selectedForm?.title || 'Form';
        await fetchForms(); // Refresh forms list
        setSubmitting(false);
        setShowFormModal(false);
        setSelectedForm(null);
        alert(`${formTitle} submitted successfully!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit form');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
      setSubmitting(false);
    }
  };

  const downloadDocument = (doc: any) => {
    // In production: trigger actual download
    console.log("Downloading document:", doc.name);
    alert(`Downloading ${doc.name}...`);
  };

  return (
    <>
      <SEO title="Forms & Waivers - Fight&Flight" description="Manage your documents" />
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Forms & <span className="text-neonGreen">Waivers</span>
            </h1>
            <p className="text-white/60 text-lg">Manage your documents and agreements</p>
          </div>

          {/* Forms Incomplete Warning */}
          {!allRequiredCompleted && (
            <div className="glass-card p-4 border border-red-500/30 bg-red-500/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-red-400 font-bold">Action Required</p>
                  <p className="text-white/60 text-sm">Complete all required forms to unlock class booking</p>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-8 border border-white/10">
            <h2 className="text-2xl font-black text-white mb-6">Required Forms</h2>
            {loading ? (
              <div className="text-center py-10">
                <div className="w-10 h-10 border-4 border-neonGreen/30 border-t-neonGreen rounded-full animate-spin mx-auto" />
                <p className="text-white/60 mt-4">Loading forms...</p>
              </div>
            ) : (
            <div className="space-y-4">
              {forms.map((form, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-neonGreen/50 transition-all duration-300 flex-wrap gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className={`p-3 rounded-lg ${
                      form.status === "completed" 
                        ? "bg-neonGreen/20 text-neonGreen" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {form.status === "completed" ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{form.title}</h3>
                        {form.required && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm mb-1">{form.description}</p>
                      <p className="text-white/40 text-xs">{form.date}</p>
                    </div>
                  </div>

                  {form.status === "completed" ? (
                    <button 
                      onClick={() => handleFormClick(form)}
                      className="flex items-center gap-2 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:border-neonGreen/50 transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleFormClick(form)}
                      className="px-6 py-3 bg-neonGreen/10 text-neonGreen rounded-lg font-bold hover:bg-neonGreen hover:text-black transition-all duration-300"
                    >
                      Complete Form
                    </button>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>

          {documents.length > 0 && (
          <div className="glass-card p-8 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-neonPink" />
              <h2 className="text-2xl font-black text-white">Studio Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <button
                  key={index}
                  onClick={() => downloadDocument(doc)}
                  className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-neonPink/50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-neonPink/20 text-neonPink rounded">
                      <FileText className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-neonPink transition-colors" />
                  </div>
                  <h3 className="text-white font-bold mb-1">{doc.name}</h3>
                  <p className="text-white/40 text-xs">{doc.type} • {doc.size}</p>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Form Submission Modal */}
        {showFormModal && selectedForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card border border-white/20 max-w-2xl w-full p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => {
                  setShowFormModal(false);
                  setSelectedForm(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 text-white/60 rotate-45" />
              </button>

              <h3 className="text-2xl font-black text-white mb-2">{selectedForm?.title}</h3>
              <p className="text-white/60 mb-6">{selectedForm?.description}</p>

              {/* Mock Form Fields */}
              <div className="space-y-4 mb-6">
                {selectedForm?.fields?.map((field: string, index: number) => (
                  <div key={index}>
                    <label className="block text-white font-bold mb-2 text-sm">{field}</label>
                    {field === "Signature" ? (
                      <div className="h-32 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white/40" />
                        <span className="text-white/40 ml-2">Click to sign</span>
                      </div>
                    ) : field.includes("History") || field.includes("Goals") ? (
                      <textarea 
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonGreen/50 focus:outline-none transition-all"
                        rows={4}
                        placeholder={`Enter ${field.toLowerCase()}...`}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-neonGreen/50 focus:outline-none transition-all"
                        placeholder={`Enter ${field.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFormModal(false);
                    setSelectedForm(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Form"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}