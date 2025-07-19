declare global {
  interface Navigator {
    mediaDevices?: MediaDevices;
  }

  interface MediaDevices {
    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
    enumerateDevices(): Promise<MediaDeviceInfo[]>;
  }

  interface MediaStreamConstraints {
    audio?: boolean | MediaTrackConstraints;
    video?: boolean | MediaTrackConstraints;
  }

  interface MediaTrackConstraints {
    deviceId?: string;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
  }

  interface MediaStream {
    id: string;
    active: boolean;
    getTracks(): MediaStreamTrack[];
    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;
    clone(): MediaStream;
    onaddtrack: ((event: MediaStreamTrackEvent) => void) | null;
    onremovetrack: ((event: MediaStreamTrackEvent) => void) | null;
    onended: (() => void) | null;
  }

  interface MediaStreamTrack {
    id: string;
    kind: string;
    enabled: boolean;
    muted: boolean;
    readyState: string;
    stop(): void;
    getSettings(): MediaTrackSettings;
    getCapabilities(): MediaTrackCapabilities;
    getConstraints(): MediaTrackConstraints;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;
  }

  interface MediaTrackSettings {
    deviceId?: string;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
  }

  interface MediaTrackCapabilities {
    deviceId?: string;
    echoCancellation?: boolean[];
    noiseSuppression?: boolean[];
    autoGainControl?: boolean[];
  }

  interface MediaDeviceInfo {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }

  interface RTCConfiguration {
    iceServers?: RTCIceServer[];
    iceCandidatePoolSize?: number;
  }

  interface RTCIceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
  }

  interface RTCOfferOptions {
    offerToReceiveAudio?: boolean;
    offerToReceiveVideo?: boolean;
    voiceActivityDetection?: boolean;
    iceRestart?: boolean;
  }

  interface RTCAnswerOptions {
    voiceActivityDetection?: boolean;
  }

  interface RTCSessionDescriptionInit {
    type: RTCSdpType;
    sdp?: string;
  }

  interface RTCSessionDescription {
    type: RTCSdpType;
    sdp: string;
  }

  type RTCSdpType = "offer" | "answer" | "pranswer" | "rollback";

  interface RTCIceCandidateInit {
    candidate?: string;
    sdpMLineIndex?: number;
    sdpMid?: string;
  }

  interface RTCIceCandidate {
    candidate: string;
    sdpMLineIndex: number | null;
    sdpMid: string | null;
  }

  interface RTCPeerConnection {
    localDescription: RTCSessionDescription | null;
    remoteDescription: RTCSessionDescription | null;
    iceConnectionState: RTCIceConnectionState;
    connectionState: RTCPeerConnectionState;
    signalingState: RTCSignalingState;
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    createAnswer(
      options?: RTCAnswerOptions
    ): Promise<RTCSessionDescriptionInit>;
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
    addIceCandidate(candidate: RTCIceCandidateInit): Promise<void>;
    close(): void;
  }

  type RTCIceConnectionState =
    | "new"
    | "checking"
    | "connected"
    | "completed"
    | "failed"
    | "disconnected"
    | "closed";
  type RTCPeerConnectionState =
    | "new"
    | "connecting"
    | "connected"
    | "disconnected"
    | "failed"
    | "closed";
  type RTCSignalingState =
    | "stable"
    | "have-local-offer"
    | "have-remote-offer"
    | "have-local-pranswer"
    | "have-remote-pranswer"
    | "closed";

  var RTCPeerConnection: {
    new (configuration?: RTCConfiguration): RTCPeerConnection;
  };

  var MediaStream: {
    new (tracks?: MediaStreamTrack[]): MediaStream;
  };

  var MediaStreamTrack: {
    new (): MediaStreamTrack;
  };

  var RTCSessionDescription: {
    new (init: RTCSessionDescriptionInit): RTCSessionDescription;
  };

  var RTCIceCandidate: {
    new (init: RTCIceCandidateInit): RTCIceCandidate;
  };
}

export {};
