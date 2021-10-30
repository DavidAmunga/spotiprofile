import { useState, useEffect } from 'react';
import { getCurrentUserTopTracks } from '../spotify';
import { catchErrors } from '../utils';
import { SectionWrapper, TrackList, TimeRangeButtons } from '../components';
const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const userTopTracks = await getCurrentUserTopTracks(
        `${activeRange}_term`,
      );
      setTopTracks(userTopTracks.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);
  return (
    <main>
      {topTracks && (
        <SectionWrapper title="Top Tracks" breadcrumb="true">
          <TimeRangeButtons
            activeRange={activeRange}
            setActiveRange={setActiveRange}
           />
          <TrackList tracks={topTracks.items} />
        </SectionWrapper>
      )}
    </main>
  );
};

export default TopTracks;
