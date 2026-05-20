import Sound from 'react-native-sound';
import { Image } from 'react-native';

// Enable playback in silence mode
Sound.setCategory('Playback');

const sounds: Record<string, Sound> = {};

const SOUND_FILES: Record<string, any> = {
  start: require('@assets/sounds/start_listening.mp3'),
  stop: require('@assets/sounds/stop_listening.mp3'),
  success: require('@assets/sounds/success.mp3'),
  error: require('@assets/sounds/error.mp3'),
  warning: require('@assets/sounds/warning.mp3'),
  processing: require('@assets/sounds/processing.mp3'),
};

const getUri = (asset: any): string => {
  const resolved = Image.resolveAssetSource(asset);
  return resolved ? resolved.uri : asset;
};

/**
 * Audio Feedback Service
 *
 * Preloads and plays UI sound effects.
 */
export const AudioFeedback = {
  /**
   * Preload all sounds
   */
  preload: () => {
    Object.keys(SOUND_FILES).forEach(key => {
      const uri = getUri(SOUND_FILES[key]);
      const sound = new Sound(uri, '', error => {
        if (error) {
          console.warn(`[AudioFeedback] Failed to load sound ${key}`, error);
          return;
        }
        sounds[key] = sound;
      });
    });
  },

  /**
   * Play a specific sound by key
   */
  play: (key: 'start' | 'stop' | 'success' | 'error' | 'warning' | 'processing') => {
    const sound = sounds[key];
    if (sound) {
      sound.stop(() => {
        sound.play(success => {
          if (!success) {
            console.warn(`[AudioFeedback] Playback failed for ${key}`);
          }
        });
      });
    } else {
      // Fallback: try to load and play immediately if not preloaded
      const uri = getUri(SOUND_FILES[key]);
      const newSound = new Sound(uri, '', error => {
        if (!error) {
          newSound.play();
        }
      });
    }
  },

  /**
   * Stop all sounds
   */
  stopAll: () => {
    Object.values(sounds).forEach(s => s.stop());
  },
};
