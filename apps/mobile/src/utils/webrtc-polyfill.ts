import { Platform } from "react-native";
import { Audio } from "expo-av";

// Polyfill for navigator.mediaDevices.getUserMedia
if (Platform.OS !== "web") {
  console.log("🔧 Setting up WebRTC polyfills for React Native...");

  // Create a global navigator object if it doesn't exist
  if (typeof global.navigator === "undefined") {
    global.navigator = {} as any;
  }

  // Create mediaDevices object
  if (!global.navigator.mediaDevices) {
    global.navigator.mediaDevices = {} as any;
  }

  // Polyfill getUserMedia
  global.navigator.mediaDevices.getUserMedia = async (
    constraints: MediaStreamConstraints
  ) => {
    try {
      console.log("🎤 Requesting audio permissions via polyfill...");

      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Audio permission not granted");
      }

      // Set audio mode for voice calls
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log("✅ Audio permissions granted and mode set via polyfill");

      // Create a mock MediaStream that satisfies the Twilio SDK
      const mockStream = {
        id: "mock-stream-" + Date.now(),
        active: true,
        getTracks: () => [],
        getAudioTracks: () => [],
        getVideoTracks: () => [],
        addTrack: () => {},
        removeTrack: () => {},
        clone: () => mockStream,
        onaddtrack: null,
        onremovetrack: null,
        onended: null,
      };

      return mockStream as any;
    } catch (error) {
      console.error("❌ Error in getUserMedia polyfill:", error);
      throw error;
    }
  };

  // Polyfill enumerateDevices
  global.navigator.mediaDevices.enumerateDevices = async () => {
    return [
      {
        deviceId: "default",
        kind: "audioinput",
        label: "Default Microphone",
        groupId: "default-group",
      },
    ] as MediaDeviceInfo[];
  };

  // Polyfill RTCPeerConnection if not available
  if (typeof global.RTCPeerConnection === "undefined") {
    global.RTCPeerConnection = class RTCPeerConnection {
      private localDescription: any = null;
      private remoteDescription: any = null;
      private iceConnectionState: string = "new";
      private connectionState: string = "new";
      private signalingState: string = "stable";

      constructor(configuration?: RTCConfiguration) {
        console.log("RTCPeerConnection polyfill created");
      }

      // Add basic methods that might be called
      createOffer(options?: RTCOfferOptions) {
        return Promise.resolve({
          type: "offer",
          sdp: "mock-sdp-offer",
        } as RTCSessionDescriptionInit);
      }

      createAnswer(options?: RTCAnswerOptions) {
        return Promise.resolve({
          type: "answer",
          sdp: "mock-sdp-answer",
        } as RTCSessionDescriptionInit);
      }

      setLocalDescription(description: RTCSessionDescriptionInit) {
        this.localDescription = description;
        return Promise.resolve();
      }

      setRemoteDescription(description: RTCSessionDescriptionInit) {
        this.remoteDescription = description;
        return Promise.resolve();
      }

      addIceCandidate(candidate: RTCIceCandidateInit) {
        return Promise.resolve();
      }

      close() {
        this.iceConnectionState = "closed";
        this.connectionState = "closed";
      }

      get localDescription() {
        return this.localDescription;
      }
      get remoteDescription() {
        return this.remoteDescription;
      }
      get iceConnectionState() {
        return this.iceConnectionState;
      }
      get connectionState() {
        return this.connectionState;
      }
      get signalingState() {
        return this.signalingState;
      }
    } as any;
  }

  // Polyfill MediaStream if not available
  if (typeof global.MediaStream === "undefined") {
    global.MediaStream = class MediaStream {
      private tracks: any[] = [];
      private id: string;

      constructor(tracks?: MediaStreamTrack[]) {
        this.id = "mock-stream-" + Date.now();
        this.tracks = tracks || [];
        console.log("MediaStream polyfill created");
      }

      getTracks() {
        return this.tracks;
      }
      getAudioTracks() {
        return this.tracks.filter((t) => t.kind === "audio");
      }
      getVideoTracks() {
        return this.tracks.filter((t) => t.kind === "video");
      }
      addTrack(track: any) {
        this.tracks.push(track);
      }
      removeTrack(track: any) {
        const index = this.tracks.indexOf(track);
        if (index > -1) this.tracks.splice(index, 1);
      }
      clone() {
        return new MediaStream(this.tracks);
      }
    } as any;
  }

  // Polyfill MediaStreamTrack if not available
  if (typeof global.MediaStreamTrack === "undefined") {
    global.MediaStreamTrack = class MediaStreamTrack {
      private kind: string;
      private id: string;
      private enabled: boolean = true;
      private muted: boolean = false;
      private readyState: string = "live";

      constructor() {
        this.kind = "audio";
        this.id = "mock-track-" + Date.now();
        console.log("MediaStreamTrack polyfill created");
      }

      stop() {
        this.readyState = "ended";
      }

      getSettings() {
        return {};
      }
      getCapabilities() {
        return {};
      }
      getConstraints() {
        return {};
      }
      applyConstraints() {
        return Promise.resolve();
      }

      get kind() {
        return this.kind;
      }
      get id() {
        return this.id;
      }
      get enabled() {
        return this.enabled;
      }
      set enabled(value: boolean) {
        this.enabled = value;
      }
      get muted() {
        return this.muted;
      }
      get readyState() {
        return this.readyState;
      }
    } as any;
  }

  // Polyfill RTCSessionDescription if not available
  if (typeof global.RTCSessionDescription === "undefined") {
    global.RTCSessionDescription = class RTCSessionDescription {
      type: RTCSdpType;
      sdp: string;

      constructor(init: RTCSessionDescriptionInit) {
        this.type = init.type;
        this.sdp = init.sdp || "";
      }
    } as any;
  }

  // Polyfill RTCIceCandidate if not available
  if (typeof global.RTCIceCandidate === "undefined") {
    global.RTCIceCandidate = class RTCIceCandidate {
      candidate: string;
      sdpMLineIndex: number | null;
      sdpMid: string | null;

      constructor(init: RTCIceCandidateInit) {
        this.candidate = init.candidate || "";
        this.sdpMLineIndex = init.sdpMLineIndex || null;
        this.sdpMid = init.sdpMid || null;
      }
    } as any;
  }

  console.log("✅ WebRTC polyfills applied for React Native");
}
