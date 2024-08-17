import {
  AppRegistry,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native';

import AudioPro from './AudioProModule';
import { Event, State } from './constants';
import type {
  AddTrack,
  EventPayloadByEvent,
  NowPlayingMetadata,
  PlaybackState,
  PlayerOptions,
  Progress,
  ServiceHandler,
  Track,
  TrackMetadataBase,
  UpdateOptions,
} from './interfaces';
import resolveAssetSource from './resolveAssetSource';

const emitter =
  Platform.OS !== 'android'
    ? new NativeEventEmitter(AudioPro)
    : DeviceEventEmitter;

// MARK: - Helpers

function resolveImportedAssetOrPath(pathOrAsset: string | number | undefined) {
  return pathOrAsset === undefined
    ? undefined
    : typeof pathOrAsset === 'string'
    ? pathOrAsset
    : resolveImportedAsset(pathOrAsset);
}

function resolveImportedAsset(id?: number) {
  return id
    ? (resolveAssetSource(id) as { uri: string } | null) ?? undefined
    : undefined;
}

// MARK: - General API

/**
 * Initializes the player with the specified options.
 *
 * @param options The options to initialize the player with.
 * @see https://evergrace-co.github.io/react-native-audio-pro/docs/api/functions/lifecycle
 */
export async function setupPlayer(options: PlayerOptions = {}): Promise<void> {
  return AudioPro.setupPlayer(options);
}

/**
 * Register the playback service. The service will run as long as the player runs.
 */
export function registerPlaybackService(factory: () => ServiceHandler) {
  if (Platform.OS === 'android') {
    AppRegistry.registerHeadlessTask('AudioPro', factory);
  } else {
    setImmediate(factory());
  }
}

export function addEventListener<T extends Event>(
  event: T,
  listener: EventPayloadByEvent[T] extends never
    ? () => void
    : (event: EventPayloadByEvent[T]) => void
) {
  return emitter.addListener(event, listener);
}

/**
 * @deprecated This method should not be used, most methods reject when service is not bound.
 */
export function isServiceRunning(): Promise<boolean> {
  return AudioPro.isServiceRunning();
}

// MARK: - Queue API

/**
 * Adds one or more tracks to the queue.
 *
 * @param tracks The tracks to add to the queue.
 * @param insertBeforeIndex (Optional) The index to insert the tracks before.
 * By default, the tracks will be added to the end of the queue.
 */
export async function add(
  tracks: AddTrack[],
  insertBeforeIndex?: number
): Promise<number | void>;
/**
 * Adds a track to the queue.
 *
 * @param track The track to add to the queue.
 * @param insertBeforeIndex (Optional) The index to insert the track before.
 * By default the track will be added to the end of the queue.
 */
export async function add(
  track: AddTrack,
  insertBeforeIndex?: number
): Promise<number | void>;
export async function add(
  tracks: AddTrack | AddTrack[],
  insertBeforeIndex = -1
): Promise<number | void> {
  const resolvedTracks = (Array.isArray(tracks) ? tracks : [tracks]).map(
    (track) => ({
      ...track,
      url: resolveImportedAssetOrPath(track.url),
      artwork: resolveImportedAssetOrPath(track.artwork),
    })
  );
  return resolvedTracks.length < 1
    ? undefined
    : AudioPro.add(resolvedTracks, insertBeforeIndex);
}

/**
 * Replaces the current track or loads the track as the first in the queue.
 *
 * @param track The track to load.
 */
export async function load(track: Track): Promise<number | void> {
  return AudioPro.load(track);
}

/**
 * Move a track within the queue.
 *
 * @param fromIndex The index of the track to be moved.
 * @param toIndex The index to move the track to. If the index is larger than
 * the size of the queue, then the track is moved to the end of the queue.
 */
export async function move(fromIndex: number, toIndex: number): Promise<void> {
  return AudioPro.move(fromIndex, toIndex);
}

/**
 * Removes multiple tracks from the queue by their indexes.
 *
 * If the current track is removed, the next track will activated. If the
 * current track was the last track in the queue, the first track will be
 * activated.
 *
 * @param indexes The indexes of the tracks to be removed.
 */
export async function remove(indexes: number[]): Promise<void>;
/**
 * Removes a track from the queue by its index.
 *
 * If the current track is removed, the next track will activated. If the
 * current track was the last track in the queue, the first track will be
 * activated.
 *
 * @param index The index of the track to be removed.
 */
export async function remove(index: number): Promise<void>;
export async function remove(indexOrIndexes: number | number[]): Promise<void> {
  return AudioPro.remove(
    Array.isArray(indexOrIndexes) ? indexOrIndexes : [indexOrIndexes]
  );
}

/**
 * Clears any upcoming tracks from the queue.
 */
export async function removeUpcomingTracks(): Promise<void> {
  return AudioPro.removeUpcomingTracks();
}

/**
 * Skips to a track in the queue.
 *
 * @param index The index of the track to skip to.
 * @param initialPosition (Optional) The initial position to seek to in seconds.
 */
export async function skip(index: number, initialPosition = -1): Promise<void> {
  return AudioPro.skip(index, initialPosition);
}

/**
 * Skips to the next track in the queue.
 *
 * @param initialPosition (Optional) The initial position to seek to in seconds.
 */
export async function skipToNext(initialPosition = -1): Promise<void> {
  return AudioPro.skipToNext(initialPosition);
}

/**
 * Skips to the previous track in the queue.
 *
 * @param initialPosition (Optional) The initial position to seek to in seconds.
 */
export async function skipToPrevious(initialPosition = -1): Promise<void> {
  return AudioPro.skipToPrevious(initialPosition);
}

// MARK: - Control Center / Notifications API

/**
 * Updates the configuration for the components.
 *
 * @param options The options to update.
 * @see https://evergrace-co.github.io/react-native-audio-pro/docs/api/functions/player#updateoptionsoptions
 */
export async function updateOptions({
  alwaysPauseOnInterruption,
  ...options
}: UpdateOptions = {}): Promise<void> {
  return AudioPro.updateOptions({
    ...options,
    android: {
      // Handle deprecated alwaysPauseOnInterruption option:
      alwaysPauseOnInterruption:
        options.android?.alwaysPauseOnInterruption ?? alwaysPauseOnInterruption,
      ...options.android,
    },
    icon: resolveImportedAsset(options.icon),
    playIcon: resolveImportedAsset(options.playIcon),
    pauseIcon: resolveImportedAsset(options.pauseIcon),
    stopIcon: resolveImportedAsset(options.stopIcon),
    previousIcon: resolveImportedAsset(options.previousIcon),
    nextIcon: resolveImportedAsset(options.nextIcon),
    rewindIcon: resolveImportedAsset(options.rewindIcon),
    forwardIcon: resolveImportedAsset(options.forwardIcon),
  });
}

/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 *
 * @param trackIndex The index of the track whose metadata will be updated.
 * @param metadata The metadata to update.
 */
export async function updateMetadataForTrack(
  trackIndex: number,
  metadata: TrackMetadataBase
): Promise<void> {
  return AudioPro.updateMetadataForTrack(trackIndex, {
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork),
  });
}

/**
 * @deprecated Nominated for removal in the next major version. If you object
 * to this, please describe your use-case in the following issue:
 * https://github.com/evergrace-co/react-native-audio-pro/issues/1653
 */
export function clearNowPlayingMetadata(): Promise<void> {
  return AudioPro.clearNowPlayingMetadata();
}

/**
 * Updates the metadata content of the notification (Android) and the Now Playing Center (iOS)
 * without affecting the data stored for the current track.
 */
export function updateNowPlayingMetadata(
  metadata: NowPlayingMetadata
): Promise<void> {
  return AudioPro.updateNowPlayingMetadata({
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork),
  });
}

// MARK: - Player API

/**
 * Resets the player stopping the current track and clearing the queue.
 */
export async function reset(): Promise<void> {
  return AudioPro.reset();
}

/**
 * Plays or resumes the current track.
 */
export async function play(): Promise<void> {
  return AudioPro.play();
}

/**
 * Pauses the current track.
 */
export async function pause(): Promise<void> {
  return AudioPro.pause();
}

/**
 * Stops the current track.
 */
export async function stop(): Promise<void> {
  return AudioPro.stop();
}

/**
 * Sets wether the player will play automatically when it is ready to do so.
 * This is the equivalent of calling `AudioPro.play()` when `playWhenReady = true`
 * or `AudioPro.pause()` when `playWhenReady = false`.
 */
export async function setPlayWhenReady(
  playWhenReady: boolean
): Promise<boolean> {
  return AudioPro.setPlayWhenReady(playWhenReady);
}

/**
 * Gets wether the player will play automatically when it is ready to do so.
 */
export async function getPlayWhenReady(): Promise<boolean> {
  return AudioPro.getPlayWhenReady();
}

/**
 * Seeks to a specified time position in the current track.
 *
 * @param position The position to seek to in seconds.
 */
export async function seekTo(position: number): Promise<void> {
  return AudioPro.seekTo(position);
}

/**
 * Seeks by a relative time offset in the current track.
 *
 * @param offset The time offset to seek by in seconds.
 */
export async function seekBy(offset: number): Promise<void> {
  return AudioPro.seekBy(offset);
}

/**
 * Sets the volume of the player.
 *
 * @param volume The volume as a number between 0 and 1.
 */
export async function setVolume(level: number): Promise<void> {
  return AudioPro.setVolume(level);
}

/**
 * Sets the playback rate.
 *
 * @param rate The playback rate to change to, where 0.5 would be half speed,
 * 1 would be regular speed, 2 would be double speed etc.
 */
export async function setRate(rate: number): Promise<void> {
  return AudioPro.setRate(rate);
}

/**
 * Sets the queue.
 *
 * @param tracks The tracks to set as the queue.
 * @see https://evergrace-co.github.io/react-native-audio-pro/docs/api/constants/repeat-mode
 */
export async function setQueue(tracks: Track[]): Promise<void> {
  return AudioPro.setQueue(tracks);
}

/**
 * Sets the queue repeat mode.
 *
 * @param repeatMode The repeat mode to set.
 * @see https://evergrace-co.github.io/react-native-audio-pro/docs/api/constants/repeat-mode
 */
export async function setRepeatMode(mode: RepeatMode): Promise<RepeatMode> {
  return AudioPro.setRepeatMode(mode);
}

// MARK: - Getters

/**
 * Gets the volume of the player as a number between 0 and 1.
 */
export async function getVolume(): Promise<number> {
  return AudioPro.getVolume();
}

/**
 * Gets the playback rate where 0.5 would be half speed, 1 would be
 * regular speed and 2 would be double speed etc.
 */
export async function getRate(): Promise<number> {
  return AudioPro.getRate();
}

/**
 * Gets a track object from the queue.
 *
 * @param index The index of the track.
 * @returns The track object or undefined if there isn't a track object at that
 * index.
 */
export async function getTrack(index: number): Promise<Track | undefined> {
  return AudioPro.getTrack(index);
}

/**
 * Gets the whole queue.
 */
export async function getQueue(): Promise<Track[]> {
  return AudioPro.getQueue();
}

/**
 * Gets the index of the active track in the queue or undefined if there is no
 * current track.
 */
export async function getActiveTrackIndex(): Promise<number | undefined> {
  return (await AudioPro.getActiveTrackIndex()) ?? undefined;
}

/**
 * Gets the active track or undefined if there is no current track.
 */
export async function getActiveTrack(): Promise<Track | undefined> {
  return (await AudioPro.getActiveTrack()) ?? undefined;
}


/**
 * Gets information on the progress of the currently active track, including its
 * current playback position in seconds, buffered position in seconds and
 * duration in seconds.
 */
export async function getProgress(): Promise<Progress> {
  return AudioPro.getProgress();
}

/**
 * Gets the playback state of the player.
 *
 * @see https://evergrace-co.github.io/react-native-audio-pro/docs/api/constants/state
 */
export async function getPlaybackState(): Promise<PlaybackState> {
  return AudioPro.getPlaybackState();
}

/**
 * Retries the current item when the playback state is `State.Error`.
 */
export async function retry() {
  return AudioPro.retry();
}
