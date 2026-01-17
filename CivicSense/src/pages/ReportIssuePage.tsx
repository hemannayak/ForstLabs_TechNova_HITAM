import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, Loader, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Issue } from '../types';

const ReportIssuePage: React.FC = () => {
  const { currentUser, processIssueWithAI } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pothole' as Issue['type'],
    severityScore: 5
  });
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{
    angle1: File | null;
    angle2: File | null;
  }>({
    angle1: null,
    angle2: null
  });
  const [imagePreviews, setImagePreviews] = useState<{
    angle1: string;
    angle2: string;
  }>({
    angle1: '',
    angle2: ''
  });
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState<'idle' | 'uploading' | 'analyzing' | 'saving' | 'complete'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRefs = useRef<{
    angle1: HTMLInputElement | null;
    angle2: HTMLInputElement | null;
  }>({
    angle1: null,
    angle2: null
  });

  const steps = [
    { title: 'Capture Evidence', icon: Camera },
    { title: 'Pin Location', icon: MapPin },
    { title: 'Issue Details', icon: Video },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, angle: 'angle1' | 'angle2') => {
    const file = e.target.files?.[0];
    if (file) {
      setImages(prev => ({ ...prev, [angle]: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => ({ ...prev, [angle]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({
            lat: 17.3850,
            lng: 78.4867,
            address: 'Hyderabad Center, Telangana, India'
          });
          setGettingLocation(false);
        }
      );
    } else {
      setLocation({
        lat: 17.3850,
        lng: 78.4867,
        address: 'Hyderabad Center, Telangana, India'
      });
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!images.angle1 || !location || !formData.title.trim()) return;

    setIsSubmitting(true);
    setSubmissionStage('uploading');
    setError(null);

    try {
      const reporterName = currentUser
        ? ((currentUser as any)?.displayName || currentUser.email?.split('@')[0] || 'Anonymous')
        : 'Anonymous User';

      const approvedIssue = await processIssueWithAI(
        images.angle1,
        images.angle2 || undefined,
        {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          severity: formData.severityScore >= 7 ? 'high' : formData.severityScore >= 4 ? 'moderate' : 'low',
          severityScore: formData.severityScore,
          location,
          reportedBy: reporterName
        }
      );

      if (approvedIssue) {
        setPrediction(approvedIssue.aiPrediction);
        setIsSubmitted(true);
      } else {
        setError('Your report was rejected because the images appear to be AI-generated or manipulated.');
      }
    } catch (error) {
      setError('Failed to process your report. Please try again.');
      console.error('Report submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !images.angle1) {
      setError('Please upload at least the main photo.');
      return;
    }
    if (currentStep === 1 && !location) {
      setError('Please capture your location.');
      return;
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const getSeverityColor = (score: number) => {
    if (score >= 7) return 'text-red-600 bg-red-100';
    if (score >= 4) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 7) return 'High';
    if (score >= 4) return 'Moderate';
    return 'Low';
  };

  const getStageMessage = (stage: string) => {
    switch (stage) {
      case 'uploading': return 'Uploading evidence...';
      case 'analyzing': return 'AI analyzing issue...';
      case 'saving': return 'Saving report...';
      case 'complete': return 'Done!';
      default: return 'Processing...';
    }
  };

  if (isSubmitted && prediction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center border border-green-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Report Submitted!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your report has been verified by AI and logged. A public poll has been created for community validation.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">AI Analysis Result</h3>
              <span className="text-sm text-green-600 font-medium px-2 py-1 bg-green-100 rounded-md">Verified</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</div>
                <div className="font-bold text-gray-900 capitalize">{prediction.type}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confidence</div>
                <div className="font-bold text-gray-900">{(prediction.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Report Another
            </button>
            <button
              onClick={() => window.location.href = '/map'}
              className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              View on Map
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Report</h1>
        <p className="text-gray-500">Help us improve the city by reporting issues.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStep;
          return (
            <div key={index} className="flex flex-col items-center bg-white px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-3xl shadow-xl p-6 min-h-[400px] flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl flex items-center text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upload Evidence</h2>
                  <p className="text-sm text-gray-500">Take clear photos of the issue</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Photo 1 */}
                  <div
                    onClick={() => fileInputRefs.current.angle1?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${imagePreviews.angle1 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                      }`}
                  >
                    {imagePreviews.angle1 ? (
                      <img src={imagePreviews.angle1} className="w-full h-full object-cover rounded-2xl" alt="Evidence 1" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs font-medium text-gray-500">Main Photo *</span>
                      </>
                    )}
                  </div>

                  {/* Photo 2 */}
                  <div
                    onClick={() => fileInputRefs.current.angle2?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${imagePreviews.angle2 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                      }`}
                  >
                    {imagePreviews.angle2 ? (
                      <img src={imagePreviews.angle2} className="w-full h-full object-cover rounded-2xl" alt="Evidence 2" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs font-medium text-gray-500">Angle 2</span>
                      </>
                    )}
                  </div>
                </div>

                <input type="file" ref={el => fileInputRefs.current.angle1 = el} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'angle1')} />
                <input type="file" ref={el => fileInputRefs.current.angle2 = el} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'angle2')} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 text-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pin Location</h2>
                <p className="text-sm text-gray-500 px-4">We need exact coordinates to send the team.</p>

                <button
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all group"
                >
                  {gettingLocation ? (
                    <div className="flex items-center justify-center text-blue-600">
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Locating...
                    </div>
                  ) : location ? (
                    <div className="text-blue-700">
                      <div className="font-semibold text-lg mb-1">Location Pinned!</div>
                      <div className="text-xs opacity-75">{location.address}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-600">
                      <span className="font-semibold">Tap to fetch location</span>
                    </div>
                  )}
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-4">Final Details</h2>

                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Broken Road near School"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['pothole', 'crack', 'waterlogging', 'other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type: type as any })}
                        className={`p-2 rounded-lg text-sm font-medium border transition-all ${formData.type === type
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Severity: {getSeverityLabel(formData.severityScore)}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.severityScore}
                    onChange={(e) => setFormData({ ...formData, severityScore: parseInt(e.target.value) })}
                    className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg shadow-indigo-200 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  {getStageMessage(submissionStage)}
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;