import { Mic, MicOff, Loader2, Volume2, AlertCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { userActions } from "~/stores/userStore";
import { api } from "~/utils/api";

interface VoiceRecordingModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onError: () => void; // Callback to show create activity dialog on error
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'processing' | 'error';

export function VoiceRecordingModal({
	open,
	onOpenChange,
	onError,
}: VoiceRecordingModalProps) {
	const [state, setState] = React.useState<RecordingState>('idle');
	const [timeRemaining, setTimeRemaining] = React.useState(60); // 1 minute limit
	const [audioLevel, setAudioLevel] = React.useState(0);
	const [error, setError] = React.useState<string>('');

	// Recording refs
	const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
	const audioStreamRef = React.useRef<MediaStream | null>(null);
	const audioContextRef = React.useRef<AudioContext | null>(null);
	const analyserRef = React.useRef<AnalyserNode | null>(null);
	const animationFrameRef = React.useRef<number | null>(null);
	const timerRef = React.useRef<NodeJS.Timeout | null>(null);
	const audioChunksRef = React.useRef<Blob[]>([]);

	// Audio level monitoring
	const monitorAudioLevel = React.useCallback(() => {
		if (analyserRef.current) {
			const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
			analyserRef.current.getByteFrequencyData(dataArray);

			// Calculate average audio level
			const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
			setAudioLevel(average / 255); // Normalize to 0-1
		}
		animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
	}, []);

	// Start recording
	const startRecording = React.useCallback(async () => {
		try {
			setState('requesting');
			setError('');

			// Request microphone permission
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					sampleRate: 16000, // Good for speech recognition
				}
			});

			audioStreamRef.current = stream;

			// Set up audio context for level monitoring
			audioContextRef.current = new AudioContext();
			const source = audioContextRef.current.createMediaStreamSource(stream);
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 256;
			source.connect(analyserRef.current);

			// Set up media recorder with WebM Opus
			const options = {
				mimeType: 'audio/webm;codecs=opus',
				audioBitsPerSecond: 16000, // Good quality for speech
			};

			// Fallback for browsers that don't support WebM Opus
			const mimeType = MediaRecorder.isTypeSupported(options.mimeType)
				? options.mimeType
				: 'audio/webm';

			mediaRecorderRef.current = new MediaRecorder(stream, {
				mimeType,
				audioBitsPerSecond: 16000,
			});

			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = () => {
				processRecording();
			};

			// Start recording
			mediaRecorderRef.current.start();
			setState('recording');
			setTimeRemaining(60);

			// Start audio level monitoring
			monitorAudioLevel();

			// Start countdown timer
			timerRef.current = setInterval(() => {
				setTimeRemaining((prev) => {
					if (prev <= 1) {
						stopRecording();
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

		} catch (err) {
			console.error('Error starting recording:', err);
			if (err instanceof Error && err.name === 'NotAllowedError') {
				setError('Microphone permission denied. Please allow microphone access and try again.');
			} else {
				setError('Failed to start recording. Please check your microphone and try again.');
			}
			setState('error');
		}
	}, [monitorAudioLevel]);

	// Stop recording
	const stopRecording = React.useCallback(() => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
			mediaRecorderRef.current.stop();
		}

		// Clean up audio monitoring
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		if (timerRef.current !== null) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (audioStreamRef.current) {
			audioStreamRef.current.getTracks().forEach(track => track.stop());
		}
		if (audioContextRef.current) {
			audioContextRef.current.close();
		}

		setAudioLevel(0);
	}, []);

	// Process recording and send to API
	const processRecording = React.useCallback(async () => {
		setState('processing');

		try {
			// Create blob from audio chunks
			const audioBlob = new Blob(audioChunksRef.current, {
				type: mediaRecorderRef.current?.mimeType || 'audio/webm'
			});

			if (audioBlob.size === 0) {
				throw new Error('No audio data recorded');
			}

			// Create form data for upload
			const formData = new FormData();
			formData.append('audio', audioBlob, 'recording.webm');

			// Send to API for processing
			const response = await api.activities.createFromVoice(formData);

			// Create activity with the processed data
			await userActions.createActivity({
				title: response.title,
				notes: response.notes || undefined,
				status: 'new',
				date: new Date().toISOString().split('T')[0], // Today's date
			});

			// Show success toast
			toast.success("Activity created from voice recording!", {
				description: `"${response.title}" has been added to your activities.`,
			});

			// Success - close modal
			onOpenChange(false);

		} catch (err) {
			console.error('Error processing recording:', err);
			setError('Failed to process recording. Please try again.');
			setState('error');

			// Show create activity dialog as fallback
			setTimeout(() => {
				onError();
				onOpenChange(false);
			}, 2000);
		}
	}, [onOpenChange, onError]);

	// Toggle recording with 't' key
	useKeyboardShortcuts([
		{
			key: 't',
			handler: () => {
				if (open) {
					if (state === 'recording') {
						stopRecording();
					} else if (state === 'idle') {
						startRecording();
					}
				}
			},
		},
		{
			key: 'Escape',
			handler: () => {
				if (open && state !== 'processing') {
					if (state === 'recording') {
						stopRecording();
					}
					onOpenChange(false);
				}
			},
		},
	]);

	// Clean up on unmount or modal close
	React.useEffect(() => {
		if (!open) {
			stopRecording();
			setState('idle');
			setError('');
			setTimeRemaining(60);
		}
	}, [open, stopRecording]);

	// Auto-start recording when modal opens
	React.useEffect(() => {
		if (open && state === 'idle') {
			// Small delay to ensure modal is fully rendered
			setTimeout(startRecording, 100);
		}
	}, [open, state, startRecording]);

	const getStatusText = () => {
		switch (state) {
			case 'requesting':
				return 'Requesting microphone access...';
			case 'recording':
				return `Recording... ${timeRemaining}s remaining`;
			case 'processing':
				return 'Processing your recording...';
			case 'error':
				return error;
			default:
				return 'Ready to record';
		}
	};

	const getIcon = () => {
		switch (state) {
			case 'requesting':
			case 'processing':
				return <Loader2 className="w-8 h-8 animate-spin text-primary" />;
			case 'recording':
				return <Mic className="w-8 h-8 text-red-500" />;
			case 'error':
				return <AlertCircle className="w-8 h-8 text-red-500" />;
			default:
				return <MicOff className="w-8 h-8 text-muted-foreground" />;
		}
	};

	// Wave visualization component
	const WaveVisualization = () => {
		if (state !== 'recording') {
			return (
				<div className="flex items-center justify-center space-x-1 h-16">
					{Array.from({ length: 20 }).map((_, i) => (
						<div
							key={i}
							className="w-1 bg-primary/30 rounded-full transition-all duration-300"
							style={{
								height: state === 'processing' ? '8px' : '4px',
								animationDelay: `${i * 50}ms`,
							}}
						/>
					))}
				</div>
			);
		}

		// Active recording visualization
		return (
			<div className="flex items-center justify-center space-x-1 h-16">
				{Array.from({ length: 20 }).map((_, i) => {
					const height = Math.max(4, audioLevel * 40 + Math.random() * 10);
					return (
						<div
							key={i}
							className="w-1 bg-red-500 rounded-full transition-all duration-100"
							style={{
								height: `${height}px`,
								opacity: 0.7 + (audioLevel * 0.3),
							}}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
						{getIcon()}
					</div>
					<DialogTitle className="text-center">Voice Recording</DialogTitle>
					<DialogDescription className="text-center">
						{getStatusText()}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pt-4">
					{/* Wave Visualization */}
					<WaveVisualization />

					{/* Recording Controls */}
					{state === 'recording' && (
						<div className="text-center space-y-4">
							<div className="text-sm text-muted-foreground">
								Press <kbd className="px-2 py-1 bg-muted rounded text-xs">T</kbd> again to stop recording
							</div>
							<Button
								onClick={stopRecording}
								variant="outline"
								className="w-full"
							>
								<MicOff className="w-4 h-4 mr-2" />
								Stop Recording
							</Button>
						</div>
					)}

					{/* Error State */}
					{state === 'error' && (
						<div className="text-center space-y-4">
							<div className="text-sm text-red-600">{error}</div>
							<div className="flex gap-2">
								<Button
									onClick={startRecording}
									variant="outline"
									className="flex-1"
								>
									Try Again
								</Button>
								<Button
									onClick={() => {
										onError();
										onOpenChange(false);
									}}
									className="flex-1"
								>
									Manual Entry
								</Button>
							</div>
						</div>
					)}

					{/* Instructions */}
					{state === 'idle' && (
						<div className="text-center text-sm text-muted-foreground">
							Press <kbd className="px-2 py-1 bg-muted rounded text-xs">T</kbd> to start recording
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}