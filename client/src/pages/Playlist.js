import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { catchErrors } from '../utils';
import { getPlaylistById, getAudioFeaturesForTracks } from '../spotify';
import { StyledHeader, StyledDropdown } from '../styles';
import { SectionWrapper, TrackList } from '../components';
import axios from 'axios';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [sortValue, setSortValue] = useState('');
  const sortOptions = ['danceability', 'tempo', 'energy'];

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getPlaylistById(id);
      setPlaylist(data);
      setTracksData(data.tracks);
    };

    catchErrors(fetchData());
  }, [id]);

  // When tracksData updates , compile arrays of tracks and audioFeatures
  useEffect(() => {
    if (!tracksData) {
      return;
    }

    // When tracksData updates, check if there are more tracks to fetch
    // then update the state variable
    const fetchMoreData = async () => {
      if (tracksData.next) {
        const { data } = await axios.get(tracksData.next);
        setTracksData(data);
      }
    };

    setTracks((tracks) => [...(tracks ? tracks : []), ...tracksData.items]);

    // Fetch next set of tracks as needed
    catchErrors(fetchMoreData());

    // Also update the audiofeatures state variable using the track ids
    const fetchAudioFeatures = async () => {
      const ids = tracksData.items.map(({ track }) => track.id).join(',');
      const { data } = await getAudioFeaturesForTracks(ids);
      setAudioFeatures((audioFeatures) => [
        ...(audioFeatures ? audioFeatures : []),
        ...data['audio_features'],
      ]);
    };
    catchErrors(fetchAudioFeatures());
  }, [tracksData]);

  const tracksWithAudioFeatures = useMemo(() => {
    if (!tracks || !audioFeatures) {
      return;
    }
    return tracks.map(({ track }) => {
      const trackToAdd = track;

      if (!track.audio_features) {
        const audioFeaturesObj = audioFeatures.find((item) => {
          if (!item || !track) {
            return null;
          }
          return item.id === track.id;
        });
        trackToAdd['audio_features'] = audioFeaturesObj;
      }
      return trackToAdd;
    });
  }, [tracks, audioFeatures]);

  // Sort Tracks by Audio features to be used in template
  const sortedTracks = useMemo(() => {
    if (!tracksWithAudioFeatures) {
      return null;
    }
    return [...tracksWithAudioFeatures].sort((a, b) => {
      const aFeatures = a['audio_features'];
      const bFeatures = b['audio_features'];

      if (!aFeatures || !bFeatures) {
        return false;
      }

      return bFeatures[sortValue] - aFeatures[sortValue];
    });
  }, [sortValue, tracksWithAudioFeatures]);

  return (
    <>
      {playlist && (
        <>
          <StyledHeader>
            <div className="header__inner">
              {playlist.images.length && playlist.images[0].url && (
                <img
                  className="header__img"
                  src={playlist.images[0].url}
                  alt="Playlist Artwork"
                />
              )}
              <div>
                <div className="header__overline">Playlist</div>
                <h1 className="header__name">{playlist.name}</h1>
                <p className="header__meta">
                  {playlist.followers.total ? (
                    <span>
                      {playlist.followers.total}{' '}
                      {`follower${playlist.followers.total !== 1 ? 's' : ''}`}
                    </span>
                  ) : null}
                  <span>
                    {playlist.tracks.total}{' '}
                    {`song${playlist.tracks.total !== 1 ? 's' : ''}`}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
        </>
      )}
      <main>
        <SectionWrapper title="Playlist" breadcrumbe={true}>
          <StyledDropdown active={!!sortValue}>
            <label htmlFor="order-select" className="sr-only">
              Sort Tracks
            </label>
            <select
              name="track-order"
              id="order-select"
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="">Sort Tracks</option>
              {sortOptions.map((option, i) => (
                <option value={option} key={i}>
                  {`${option.charAt(0).toUpperCase()}${option.slice(1)}`}
                </option>
              ))}
            </select>
          </StyledDropdown>

          {sortedTracks && <TrackList tracks={sortedTracks} />}
        </SectionWrapper>
      </main>
    </>
  );
};

export default Playlist;
